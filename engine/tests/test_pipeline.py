import asyncio
import sys
import os

# Ensure engine path is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.schemas import FeasibilityRequest
from app.routers.feasibility import execute_feasibility_pipeline
from app.services.geocoding import search_popular_locations

async def run_smoke_test():
    print("Testing Geocoding Search...")
    results = search_popular_locations("madha")
    print(f"Autocomplete results count: {len(results)}")
    assert len(results) > 0, "Expected at least 1 result for 'madha'"
    print(f"Top result: {results[0]}")
    
    print("\nTesting Feasibility Pipeline (Specialty Coffee Shop in Madhapur)...")
    req = FeasibilityRequest(
        category="Specialty Coffee Shop & Cafe",
        locality="Madhapur",
        city="Hyderabad"
    )
    report = await execute_feasibility_pipeline(req, force_unlocked=True)
    print(f"Report Generated Successfully: ID={report.report_id}")
    print(f"Overall Score: {report.overall_score}/100")
    print(f"Viability Status: {report.viability_status}")
    print(f"Competitors count (2km): {report.competitor_analysis.total_competitors_2km}")
    print(f"Demand Anchors: {len(report.demand_anchors.anchors)}")
    print(f"Break-Even Daily Orders: {report.break_even.required_daily_customers}")
    print(f"Strategic Gaps Count: {len(report.strategic_gaps)}")
    print("\nPipeline Smoke Test Passed!")

if __name__ == "__main__":
    asyncio.run(run_smoke_test())
