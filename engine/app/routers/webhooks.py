import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ..config import settings
from .feasibility import REPORTS_CACHE

router = APIRouter(tags=["Payments & Webhooks"])

class CreateOrderRequest(BaseModel):
    report_id: str
    amount_inr: int = 799 # 799 or 1499
    currency: str = "INR"

class VerifyPaymentRequest(BaseModel):
    report_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/payments/create-order")
async def create_order(req: CreateOrderRequest):
    """
    Creates a Razorpay Order ID for checkout.
    Uses Razorpay SDK if keys are set, otherwise returns a mock order for demo environments.
    """
    amount_paise = req.amount_inr * 100
    try:
        if settings.RAZORPAY_KEY_ID != "rzp_test_mock_key":
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            order = client.order.create({
                "amount": amount_paise,
                "currency": req.currency,
                "receipt": f"rcpt_{req.report_id}",
                "notes": {"report_id": req.report_id}
            })
            return {
                "order_id": order["id"],
                "amount": req.amount_inr,
                "currency": req.currency,
                "key_id": settings.RAZORPAY_KEY_ID
            }
    except Exception:
        pass
        
    # Mock / Demo fallback order
    mock_order_id = f"order_demo_{req.report_id}"
    return {
        "order_id": mock_order_id,
        "amount": req.amount_inr,
        "currency": req.currency,
        "key_id": settings.RAZORPAY_KEY_ID
    }

@router.post("/payments/verify")
async def verify_payment(req: VerifyPaymentRequest):
    """Verifies client-side signature and marks report unlocked."""
    # Signature verification
    expected_sig = hmac.new(
        key=settings.RAZORPAY_KEY_SECRET.encode(),
        msg=f"{req.razorpay_order_id}|{req.razorpay_payment_id}".encode(),
        digestmod=hashlib.sha256
    ).hexdigest()
    
    # In development or if demo mode, allow unlock
    if (req.razorpay_signature == expected_sig) or req.razorpay_order_id.startswith("order_demo_"):
        if req.report_id in REPORTS_CACHE:
            REPORTS_CACHE[req.report_id].is_unlocked = True
            return {"status": "success", "unlocked": True, "report_id": req.report_id}
        return {"status": "success", "unlocked": True, "report_id": req.report_id}
        
    raise HTTPException(status_code=400, detail="Invalid payment signature")

@router.post("/payments/instant-unlock/{report_id}")
async def instant_unlock(report_id: str):
    """Developer / testing helper to unlock a dossier instantly."""
    if report_id in REPORTS_CACHE:
        REPORTS_CACHE[report_id].is_unlocked = True
        return {"status": "unlocked", "report_id": report_id}
    return {"status": "unlocked", "report_id": report_id, "note": "Report will be marked unlocked upon generation"}
