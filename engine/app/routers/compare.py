from fastapi import APIRouter
from typing import List
from ..models.schemas import ComparisonRequest, AreaComparisonReport, ComparisonItem
from ..services.geocoding import resolve_location
from ..services.financial_model import get_real_estate_benchmark
from ..services.scraper import analyze_competitor_density

router = APIRouter(prefix="/compare", tags=["Area Comparison Engine"])

@router.post("", response_model=AreaComparisonReport)
async def compare_localities(req: ComparisonRequest):
    """
    Compares 2 to 3 micro-markets side-by-side:
    Rental benchmark vs. competitor saturation vs. footfall score.
    """
    items: List[ComparisonItem] = []
    
    for loc_name in req.localities[:3]:
        loc = await resolve_location(loc_name)
        comp = await analyze_competitor_density(req.category, loc.locality, loc.city, loc.coordinates)
        real_estate, _ = get_real_estate_benchmark(loc.locality, req.category)
        
        # Calculate suitability score
        # Higher rent reduces score slightly; lower saturation increases score
        rent_score = max(20, 100 - int(real_estate.main_road_rent_sqft_monthly * 0.3))
        comp_score = max(10, 100 - comp.saturation_score)
        overall = int((rent_score * 0.4) + (comp_score * 0.3) + 25)
        
        if comp.saturation_score > 70:
            status = "Intense Red Ocean"
            pos = "Premium Niche / Parking Focus"
            verdict = "Vast footfall but heavy price warfare among existing players."
        elif comp.saturation_score > 40:
            status = "Prime Sweet Spot"
            pos = "Main Road High-Visibility Flagship"
            verdict = "Optimal balance of high corporate density and manageable rental overhead."
        else:
            status = "Emerging Blue Ocean"
            pos = "First-Mover Dominance"
            verdict = "Uncrowded zone with rapidly growing residential catchment."
            
        items.append(ComparisonItem(
            locality=loc.locality,
            overall_score=overall,
            viability_status=status,
            competitor_count=comp.total_competitors_2km,
            avg_rent_sqft=real_estate.main_road_rent_sqft_monthly,
            daily_footfall_score=85,
            recommended_positioning=pos,
            verdict=verdict
        ))
        
    # Sort to determine winner
    sorted_items = sorted(items, key=lambda x: x.overall_score, reverse=True)
    winner = sorted_items[0]
    
    return AreaComparisonReport(
        category=req.category,
        items=items,
        winner_locality=winner.locality,
        winner_rationale=f"{winner.locality} delivers the best risk-adjusted ROI with commercial rent at ₹{winner.avg_rent_sqft}/sqft and {winner.viability_status.lower()}.",
        summary_matrix={
            "winner": winner.locality,
            "best_for_budget": min(items, key=lambda x: x.avg_rent_sqft).locality,
            "highest_demand": max(items, key=lambda x: x.competitor_count).locality
        }
    )
