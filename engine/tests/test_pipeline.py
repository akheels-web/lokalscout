import asyncio
import sys
import os

# Ensure UTF-8 stdout encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure engine path is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import time
from app.models.schemas import FeasibilityRequest
from app.routers.feasibility import execute_feasibility_pipeline
from app.services.geocoding import search_popular_locations
from app.db.database import get_database_stats
from app.services.rent_scraper import ensure_rent_data
from app.services.search_trends import ensure_search_trends_data

async def run_smoke_test():
    print("Testing Geocoding Search...")
    results = search_popular_locations("madha")
    print(f"Autocomplete results count: {len(results)}")
    assert len(results) > 0, "Expected at least 1 result for 'madha'"
    print(f"Top result: {results[0]}")
    
    print("\nTesting Commercial Rent Harvester...")
    rent_listings = await ensure_rent_data("Madhapur", "Hyderabad")
    print(f"Rent listings count: {len(rent_listings)}")
    assert len(rent_listings) >= 3, "Expected at least 3 commercial rent listings"
    print(f"Sample listing: {rent_listings[0]['carpet_area_sqft']} sqft @ ₹{rent_listings[0]['asking_rent_monthly']:,}/mo (₹{rent_listings[0]['rent_per_sqft']}/sqft)")

    print("\nTesting Search Trends Service...")
    trends = await ensure_search_trends_data("Madhapur", "Hyderabad", "Specialty Coffee Shop & Cafe")
    print(f"Search trends count: {len(trends)}")
    assert len(trends) == 4, "Expected 4 search trend keywords"
    print(f"Top query: '{trends[0].keyword}' -> {trends[0].monthly_searches:,} monthly searches ({trends[0].growth_yoy})")

    print("\nTesting Feasibility Pipeline (First Run - May Crawl)...")
    req = FeasibilityRequest(
        category="Specialty Coffee Shop & Cafe",
        locality="Madhapur",
        city="Hyderabad"
    )
    t0 = time.time()
    report1 = await execute_feasibility_pipeline(req, force_unlocked=True)
    t1 = time.time()
    print(f"Report 1 Generated in {t1 - t0:.2f}s: ID={report1.report_id}")
    print(f"Overall Score: {report1.overall_score}/100")
    print(f"Viability Status: {report1.viability_status}")
    print(f"Competitors count (2km): {report1.competitor_analysis.total_competitors_2km}")
    print(f"Demand Anchors: {len(report1.demand_anchors.anchors)}")
    print(f"Break-Even Daily Orders: {report1.break_even.required_daily_customers}")
    print(f"Search Intent queries: {len(report1.search_intent)}")
    print(f"Matched Commercial Properties: {len(report1.matched_properties)}")
    print(f"Top Property: {report1.matched_properties[0].title} (₹{report1.matched_properties[0].rent_monthly_inr:,}/mo)")

    print("\nTesting Feasibility Pipeline (Second Run - Cache Hit Speed)...")
    t2 = time.time()
    report2 = await execute_feasibility_pipeline(req, force_unlocked=True)
    t3 = time.time()
    print(f"Report 2 Generated in {t3 - t2:.2f}s: ID={report2.report_id}")
    assert (t3 - t2) < 2.5, "Second run should be fast (<2.5s) due to SQLite caching"

    print("\nTesting Database Health Statistics...")
    stats = get_database_stats()
    print(f"Database Stats: {stats}")
    assert stats["rent_listings_cached"] > 0, "Expected cached rent listings"
    assert stats["search_trends_cached"] > 0, "Expected cached search trends"

    print("\nAll ₹0 Data Pipeline Smoke Tests Passed Successfully!")

if __name__ == "__main__":
    asyncio.run(run_smoke_test())
