import uuid
import datetime
from fastapi import APIRouter, HTTPException, Response
from typing import Dict
from ..models.schemas import (
    FeasibilityRequest,
    FeasibilityReport,
    FeasibilityPreview,
    LocationInfo,
)
from ..services.geocoding import resolve_location
from ..services.overpass import extract_demand_anchors
from ..services.scraper import analyze_competitor_density
from ..services.financial_model import get_real_estate_benchmark, calculate_breakeven
from ..services.ai_synthesis import synthesize_executive_intelligence
from ..services.pdf_generator import render_report_html, generate_pdf_bytes

router = APIRouter(prefix="/feasibility", tags=["Feasibility Intelligence"])

# In-memory fast cache for generated reports
REPORTS_CACHE: Dict[str, FeasibilityReport] = {}

async def execute_feasibility_pipeline(req: FeasibilityRequest, force_unlocked: bool = False) -> FeasibilityReport:
    """Executes the full multi-stream data pipeline."""
    # 1. Resolve Location & Coordinates
    location: LocationInfo = await resolve_location(req.locality, req.city)
    
    # 2. Extract Footfall Anchors (Overpass API + Curated Fallback)
    anchors = await extract_demand_anchors(location.coordinates, location.locality)
    
    # 3. Analyze Competitor Saturation & Sentiment
    competitors = await analyze_competitor_density(
        req.category, location.locality, location.city, location.coordinates
    )
    
    # 4. Calculate Real Estate & Break-Even Economics
    real_estate, v_profile = get_real_estate_benchmark(location.locality, req.category)
    break_even = calculate_breakeven(real_estate, v_profile)
    
    # 5. Gemini Flash / Algorithmic Executive Intelligence Synthesis
    synthesis = await synthesize_executive_intelligence(
        vertical=req.category,
        location=location,
        competitors=competitors,
        anchors=anchors,
        real_estate=real_estate,
        break_even=break_even
    )
    
    report_id = f"LS-{uuid.uuid4().hex[:8].upper()}"
    now_str = datetime.datetime.now().strftime("%d %B %Y, %I:%M %p")
    
    report = FeasibilityReport(
        report_id=report_id,
        business_vertical=req.category,
        location=location,
        generated_at=now_str,
        overall_score=synthesis["overall_score"],
        viability_status=synthesis["viability_status"],
        risk_rating=synthesis["risk_rating"],
        confidence_index=synthesis["confidence_index"],
        executive_verdict=synthesis["executive_verdict"],
        unfair_advantages=synthesis["unfair_advantages"],
        competitor_analysis=competitors,
        price_tier_analysis={
            "distribution": competitors.price_distribution,
            "sweet_spot_tier": "Mid-Range to Upper Mid-Range",
            "opportunity_rationale": "High concentration of corporate tech employees willing to spend ₹350+ per visit if ambience & parking friction are addressed."
        },
        demand_anchors=anchors,
        peak_windows=synthesis["peak_windows"],
        search_intent=synthesis["search_intent"],
        real_estate=real_estate,
        break_even=break_even,
        strategic_gaps=synthesis["strategic_gaps"],
        launch_action_plan=synthesis["launch_action_plan"],
        is_unlocked=force_unlocked
    )
    
    REPORTS_CACHE[report_id] = report
    return report

@router.post("/preview", response_model=FeasibilityPreview)
async def generate_preview(req: FeasibilityRequest):
    """
    Generates instant free teaser:
    - Overall Feasibility Score
    - Viability Classification
    - Total competitor count within 2 km
    - Top 3 footfall demand anchors
    - Teaser executive snippet
    """
    full_report = await execute_feasibility_pipeline(req, force_unlocked=False)
    
    anchors_list = [a.name for a in full_report.demand_anchors.anchors[:3]]
    
    return FeasibilityPreview(
        report_id=full_report.report_id,
        business_vertical=full_report.business_vertical,
        locality=full_report.location.locality,
        city=full_report.location.city,
        overall_score=full_report.overall_score,
        viability_status=full_report.viability_status,
        risk_rating=full_report.risk_rating,
        competitor_count_2km=full_report.competitor_analysis.total_competitors_2km,
        top_3_anchors=anchors_list,
        executive_teaser_snippet=full_report.executive_verdict[:160] + "...",
        unlock_price_inr=799
    )

@router.post("/generate", response_model=FeasibilityReport)
async def generate_report(req: FeasibilityRequest):
    """Generates the full 10-section dossier."""
    return await execute_feasibility_pipeline(req, force_unlocked=False)

@router.get("/report/{report_id}", response_model=FeasibilityReport)
async def get_report_by_id(report_id: str):
    """Retrieves an existing dossier by ID."""
    if report_id in REPORTS_CACHE:
        return REPORTS_CACHE[report_id]
    raise HTTPException(status_code=404, detail="Report ID not found")

@router.get("/sample", response_model=FeasibilityReport)
async def get_sample_report():
    """Returns a 100% unlocked reference dossier for Specialty Coffee Shop in Madhapur."""
    sample_key = "SAMPLE-MADHAPUR-COFFEE"
    if sample_key in REPORTS_CACHE:
        return REPORTS_CACHE[sample_key]
        
    sample_req = FeasibilityRequest(
        category="Specialty Coffee Shop & Cafe",
        locality="Madhapur",
        city="Hyderabad"
    )
    report = await execute_feasibility_pipeline(sample_req, force_unlocked=True)
    report.report_id = sample_key
    REPORTS_CACHE[sample_key] = report
    return report

@router.get("/pdf/{report_id}")
async def download_report_pdf(report_id: str):
    """Returns print-ready PDF or HTML representation of the dossier."""
    if report_id not in REPORTS_CACHE:
        # If requested sample
        if report_id.upper() == "SAMPLE":
            report = await get_sample_report()
        else:
            raise HTTPException(status_code=404, detail="Report not found")
    else:
        report = REPORTS_CACHE[report_id]
        
    pdf_bytes = generate_pdf_bytes(report)
    return Response(
        content=pdf_bytes,
        media_type="text/html" if pdf_bytes.startswith(b"<!DOCTYPE") else "application/pdf",
        headers={"Content-Disposition": f"inline; filename=LokalScout_{report_id}.html"}
    )
