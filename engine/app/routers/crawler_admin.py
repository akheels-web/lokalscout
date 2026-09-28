"""
Admin & Operational Diagnostics Router for the Crawler & SQLite Cache.
Provides health stats, cache inspection, and background crawl triggering.
"""

import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

from ..db.database import (
    get_database_stats,
    get_stale_entries,
    get_all_crawled_localities,
)
from ..services.crawler import refresh_stale_data, ensure_competitor_data, ensure_poi_data
from ..services.rent_scraper import ensure_rent_data
from ..services.search_trends import ensure_search_trends_data
from ..services.geocoding import resolve_location

logger = logging.getLogger("lokalscout.crawler_admin")

router = APIRouter(prefix="/crawler", tags=["Crawler & Cache Diagnostics"])


class PreCrawlRequest(BaseModel):
    locality: str
    city: str
    category: str = "Specialty Coffee Shop & Cafe"


@router.get("/stats")
async def get_crawler_statistics() -> Dict[str, Any]:
    """Returns database size, record counts, and cache health."""
    stats = get_database_stats()
    stale_comp = get_stale_entries("competitors", max_age_days=7)
    stale_poi = get_stale_entries("poi", max_age_days=14)
    stats["stale_competitors_count"] = len(stale_comp)
    stats["stale_pois_count"] = len(stale_poi)
    stats["crawled_localities"] = get_all_crawled_localities()
    return stats


@router.post("/refresh")
async def trigger_stale_refresh(background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Triggers background refresh of localities older than 7-14 days."""
    background_tasks.add_task(refresh_stale_data)
    return {
        "status": "queued",
        "message": "Background refresh task scheduled for stale cache entries."
    }


@router.post("/precrawl")
async def precrawl_locality(req: PreCrawlRequest, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Pre-warms the cache for a specific locality + category."""
    async def _do_precrawl():
        try:
            loc = await resolve_location(req.locality, req.city)
            await ensure_competitor_data(loc.coordinates.lat, loc.coordinates.lng, loc.locality, loc.city, req.category)
            await ensure_poi_data(loc.coordinates.lat, loc.coordinates.lng, loc.locality, loc.city)
            await ensure_rent_data(loc.locality, loc.city)
            await ensure_search_trends_data(loc.locality, loc.city, req.category)
            logger.info(f"Pre-crawl completed successfully for {req.locality}, {req.city}")
        except Exception as e:
            logger.error(f"Pre-crawl failed for {req.locality}: {e}")

    background_tasks.add_task(_do_precrawl)
    return {
        "status": "queued",
        "locality": req.locality,
        "city": req.city,
        "category": req.category,
        "message": "Pre-crawl launched in background."
    }
