import uuid
import datetime
from fastapi import APIRouter, HTTPException
from typing import Dict, List
from ..models.schemas import (
    WatchdogSubscriptionRequest,
    WatchdogSubscriptionResponse,
    WatchdogAlert
)

router = APIRouter(prefix="/watchdog", tags=["Territory Watchdog"])

# In-memory storage for active watchdog subscriptions
WATCHDOG_SUBSCRIPTIONS: Dict[str, WatchdogSubscriptionResponse] = {}

SAMPLE_ALERTS_BY_CATEGORY = {
    "coffee": [
        WatchdogAlert(
            alert_id="ALT-CF-01",
            timestamp="Yesterday, 04:15 PM",
            competitor_name="Third Wave Coffee (New Extension)",
            distance_m=380,
            event_type="New Competitor Opening",
            severity="High Attention",
            summary="New 1,400 sq.ft. specialty cafe commenced commercial interior fit-outs near high-street junction.",
            recommended_counter_move="Lock in nearby tech park corporate coffee subscriptions and launch an early-bird morning combo."
        ),
        WatchdogAlert(
            alert_id="ALT-CF-02",
            timestamp="3 days ago",
            competitor_name="Blue Tokai Coffee Roasters",
            distance_m=620,
            event_type="Rating Drop Spike",
            severity="Moderate Impact",
            summary="Competitor rating dipped from 4.6 to 4.2 following recurring customer complaints about lack of car parking and seating.",
            recommended_counter_move="Highlight your dedicated valet parking or spacious seating capacity in promotional messaging."
        ),
        WatchdogAlert(
            alert_id="ALT-CF-03",
            timestamp="1 week ago",
            competitor_name="Starbucks India",
            distance_m=950,
            event_type="Significant Price Change",
            severity="Informational",
            summary="Competitor escalated beverage pricing by 8.5% across seasonal pour-overs and iced beverages.",
            recommended_counter_move="Emphasize artisanal quality beans at a 20% friendlier price point to capture value-conscious regulars."
        )
    ],
    "dental": [
        WatchdogAlert(
            alert_id="ALT-DT-01",
            timestamp="2 days ago",
            competitor_name="Clove Dental Micro-Hub",
            distance_m=450,
            event_type="New Competitor Opening",
            severity="High Attention",
            summary="Commercial signage installed for a new 2-chair dental clinic focusing on clear aligners.",
            recommended_counter_move="Host a community oral health check-up weekend to establish patient loyalty in the residential cluster."
        ),
        WatchdogAlert(
            alert_id="ALT-DT-02",
            timestamp="5 days ago",
            competitor_name="Smile Care Specialists",
            distance_m=780,
            event_type="Trade License Registered",
            severity="Moderate Impact",
            summary="New health facility trade license application registered in this municipal ward.",
            recommended_counter_move="Activate pre-booking Google Search Ads targeting high-value implants and cosmetic procedures."
        )
    ],
    "default": [
        WatchdogAlert(
            alert_id="ALT-GEN-01",
            timestamp="Yesterday, 11:30 AM",
            competitor_name="New Retail Commercial Outlet",
            distance_m=320,
            event_type="Commercial Lease Execution",
            severity="High Attention",
            summary="Ground floor 1,200 sq.ft. commercial lease finalized on main avenue.",
            recommended_counter_move="Verify trade category and review catchment footfall overlap."
        ),
        WatchdogAlert(
            alert_id="ALT-GEN-02",
            timestamp="4 days ago",
            competitor_name="Regional Chain Store",
            distance_m=850,
            event_type="Rating Drop Spike",
            severity="Moderate Impact",
            summary="Competitor reviews reflect operational friction and delivery delays.",
            recommended_counter_move="Position your outlet for rapid turnaround and consistent quality."
        )
    ]
}

@router.post("/subscribe", response_model=WatchdogSubscriptionResponse)
async def subscribe_watchdog(req: WatchdogSubscriptionRequest):
    """
    Activates monthly territory watchdog monitoring for a specified pin code and vertical.
    Monitors new competitor registrations, review shifts, and lease activities.
    """
    sub_id = f"WD-{req.pincode}-{uuid.uuid4().hex[:6].upper()}"
    
    # Match category alerts
    cat_lower = req.category.lower()
    if "coffee" in cat_lower or "cafe" in cat_lower:
        alerts = SAMPLE_ALERTS_BY_CATEGORY["coffee"]
    elif "dental" in cat_lower or "clinic" in cat_lower:
        alerts = SAMPLE_ALERTS_BY_CATEGORY["dental"]
    else:
        alerts = SAMPLE_ALERTS_BY_CATEGORY["default"]
        
    next_audit = (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%A, %I:%M %p")
    
    response = WatchdogSubscriptionResponse(
        subscription_id=sub_id,
        status="active",
        pincode=req.pincode,
        locality=req.locality,
        category=req.category,
        monitored_radius_km=2.0,
        active_alerts_count=len(alerts),
        latest_alerts=alerts,
        next_audit_date=next_audit
    )
    
    WATCHDOG_SUBSCRIPTIONS[sub_id] = response
    # Also index by pincode for convenience
    WATCHDOG_SUBSCRIPTIONS[req.pincode] = response
    return response

@router.get("/alerts/{identifier}", response_model=WatchdogSubscriptionResponse)
async def get_watchdog_alerts(identifier: str):
    """Fetches active territory watchdog alerts for a subscription ID or pin code."""
    if identifier in WATCHDOG_SUBSCRIPTIONS:
        return WATCHDOG_SUBSCRIPTIONS[identifier]
        
    # Generate on-demand preview for query
    alerts = SAMPLE_ALERTS_BY_CATEGORY["coffee"]
    next_audit = (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%A, %I:%M %p")
    return WatchdogSubscriptionResponse(
        subscription_id=f"WD-{identifier}-PREVIEW",
        status="active",
        pincode=identifier if identifier.isdigit() else "500081",
        locality="Active Territory",
        category="Commercial Territory",
        monitored_radius_km=2.0,
        active_alerts_count=len(alerts),
        latest_alerts=alerts,
        next_audit_date=next_audit
    )
