"""
Unified crawl orchestrator for LokalScout.
Coordinates Overpass API + Google Places API crawls and stores results in SQLite.

Strategy: On-demand crawl with smart caching.
  - If fresh data exists in SQLite (< 7 days for competitors, < 14 days for POIs) → serve from cache
  - If stale or missing → crawl live, store in SQLite, then serve
  - Background weekly refresh for previously-searched localities
"""

import httpx
import math
import logging
from typing import List, Dict, Any, Optional, Tuple
from ..config import settings
from ..db.database import (
    is_competitor_data_fresh,
    save_competitors,
    load_competitors,
    is_poi_data_fresh,
    save_poi_anchors,
    load_poi_anchors,
    get_stale_entries,
)
from ..services.google_places import crawl_competitors_for_locality

logger = logging.getLogger("lokalscout.crawler")


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)


# ─────────────────────────────────────────────
#  Overpass API: Competitor Discovery (Free, Unlimited)
# ─────────────────────────────────────────────

# Maps our verticals to OSM amenity/shop tags for competitor search
VERTICAL_TO_OSM_TAGS: Dict[str, str] = {
    "coffee": '"amenity"~"cafe|restaurant"',
    "dental": '"amenity"~"dentist|clinic|doctors"',
    "salon": '"shop"~"beauty|hairdresser|massage"',
    "cloud_kitchen": '"amenity"~"fast_food|restaurant"',
    "gym": '"leisure"~"fitness_centre|sports_centre"',
    "pharmacy": '"amenity"~"pharmacy"',
    "bakery": '"shop"~"bakery|pastry"',
    "pet_care": '"amenity"~"veterinary"|"shop"~"pet"',
    "coworking": '"amenity"~"coworking_space"|"office"~"coworking"',
    "restaurant": '"amenity"~"restaurant|bar"',
    "apparel": '"shop"~"clothes|boutique|fashion"',
    "optician": '"shop"~"optician"',
    "diagnostics": '"amenity"~"clinic|doctors|hospital"',
    "preschool": '"amenity"~"kindergarten|childcare|school"',
    "auto_detailing": '"shop"~"car_repair"|"amenity"~"car_wash"',
    "microbrewery": '"amenity"~"pub|bar|restaurant"',
    "organic_grocery": '"shop"~"supermarket|convenience|greengrocer"',
    "icecream_dessert": '"shop"~"ice_cream"|"amenity"~"ice_cream|cafe"',
    "generic": '"shop"~"retail"|"amenity"~"cafe|restaurant"',
}


def _normalize_vertical_key(category_name: str) -> str:
    norm = category_name.lower()
    if "dental" in norm or "clinic" in norm or "dentist" in norm:
        return "dental"
    elif "salon" in norm or "spa" in norm or "beauty" in norm:
        return "salon"
    elif "cloud" in norm or "kitchen" in norm or "qsr" in norm:
        return "cloud_kitchen"
    elif "gym" in norm or "fitness" in norm:
        return "gym"
    elif "pharmacy" in norm or "chemist" in norm:
        return "pharmacy"
    elif "bakery" in norm or "patisserie" in norm or "cake" in norm:
        return "bakery"
    elif "pet" in norm or "vet" in norm or "animal" in norm:
        return "pet_care"
    elif "cowork" in norm or "office" in norm or "workspace" in norm:
        return "coworking"
    elif "brewery" in norm or "beer" in norm or "pub" in norm:
        return "microbrewery"
    elif "restaurant" in norm or "dine" in norm or "dining" in norm:
        return "restaurant"
    elif "fashion" in norm or "apparel" in norm or "cloth" in norm or "boutique" in norm:
        return "apparel"
    elif "optician" in norm or "eyewear" in norm or "glasses" in norm:
        return "optician"
    elif "diagnostic" in norm or "pathology" in norm or "lab" in norm:
        return "diagnostics"
    elif "preschool" in norm or "daycare" in norm or "kindergarten" in norm:
        return "preschool"
    elif "auto" in norm or "car" in norm or "detailing" in norm:
        return "auto_detailing"
    elif "organic" in norm or "grocery" in norm or "supermarket" in norm:
        return "organic_grocery"
    elif "ice cream" in norm or "dessert" in norm or "gelato" in norm:
        return "icecream_dessert"
    elif "coffee" in norm or "cafe" in norm:
        return "coffee"
    return "generic"


async def crawl_competitors_overpass(
    lat: float, lng: float, category_name: str, radius_m: int = 2000
) -> List[Dict[str, Any]]:
    """
    Uses Overpass API to find real business names and locations from OpenStreetMap.
    Cost: ₹0 (completely free, unlimited).

    Returns competitor dicts without ratings (OSM doesn't have ratings).
    """
    v_key = _normalize_vertical_key(category_name)
    osm_filter = VERTICAL_TO_OSM_TAGS.get(v_key, '"amenity"~"cafe"')

    query = f"""
    [out:json][timeout:8];
    (
      node[{osm_filter}](around:{radius_m},{lat},{lng});
      way[{osm_filter}](around:{radius_m},{lat},{lng});
    );
    out center;
    """

    competitors = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                settings.OVERPASS_URL,
                data={"data": query},
                headers={"User-Agent": "LokalScout-Crawler/2.0 (contact@lokalscout.in)"},
            )
            if resp.status_code == 200:
                data = resp.json()
                for el in data.get("elements", []):
                    tags = el.get("tags", {})
                    name = tags.get("name") or tags.get("name:en")
                    if not name:
                        continue

                    e_lat = el.get("lat") or el.get("center", {}).get("lat")
                    e_lng = el.get("lon") or el.get("center", {}).get("lon")
                    dist = _haversine_km(lat, lng, e_lat, e_lng) if e_lat and e_lng else 1.0

                    competitors.append({
                        "name": name,
                        "google_place_id": None,
                        "lat": e_lat,
                        "lng": e_lng,
                        "google_rating": None,
                        "review_count": 0,
                        "price_level": None,
                        "address": tags.get("addr:full") or tags.get("addr:street", ""),
                        "distance_km": dist,
                        "complaints": [],
                        "strengths": [],
                        "source": "overpass",
                    })

                logger.info(f"Overpass: found {len(competitors)} competitors for '{category_name}' near ({lat}, {lng})")
            else:
                logger.warning(f"Overpass API error {resp.status_code}")
    except Exception as e:
        logger.warning(f"Overpass competitor crawl failed: {e}")

    return competitors


# ─────────────────────────────────────────────
#  Overpass API: POI Anchor Discovery (Free)
# ─────────────────────────────────────────────

async def crawl_poi_anchors_overpass(lat: float, lng: float, radius_m: int = 2500) -> List[Dict[str, Any]]:
    """
    Uses Overpass API to find real footfall anchor POIs (universities, tech parks, malls, metro, hospitals).
    Cost: ₹0.
    """
    query = f"""
    [out:json][timeout:8];
    (
      node["amenity"~"university|college"](around:{radius_m},{lat},{lng});
      node["office"~"it|company|government|coworking"](around:{radius_m},{lat},{lng});
      node["shop"~"mall|department_store|supermarket"](around:{radius_m},{lat},{lng});
      node["railway"~"station|subway_entrance|halt"](around:{radius_m},{lat},{lng});
      node["amenity"~"hospital"](around:{radius_m},{lat},{lng});
      way["amenity"~"university|college"](around:{radius_m},{lat},{lng});
      way["office"~"it|company"](around:{radius_m},{lat},{lng});
      way["shop"~"mall|department_store"](around:{radius_m},{lat},{lng});
      way["building"~"commercial|office"](around:{radius_m},{lat},{lng});
    );
    out center;
    """

    anchors = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                settings.OVERPASS_URL,
                data={"data": query},
                headers={"User-Agent": "LokalScout-Crawler/2.0 (contact@lokalscout.in)"},
            )
            if resp.status_code == 200:
                data = resp.json()
                for el in data.get("elements", []):
                    tags = el.get("tags", {})
                    name = tags.get("name") or tags.get("name:en")
                    if not name:
                        continue

                    e_lat = el.get("lat") or el.get("center", {}).get("lat")
                    e_lng = el.get("lon") or el.get("center", {}).get("lon")
                    dist = _haversine_km(lat, lng, e_lat, e_lng) if e_lat and e_lng else 1.5

                    # Classify category
                    category = "Commercial Hub"
                    if "amenity" in tags:
                        amenity = tags["amenity"]
                        if amenity in ("university", "college"):
                            category = "Colleges & Youth"
                        elif amenity == "hospital":
                            category = "Healthcare Hub"
                    if "office" in tags:
                        category = "Tech & Corporate Parks"
                    if "shop" in tags and tags["shop"] in ("mall", "department_store"):
                        category = "Shopping Malls & Retail"
                    if "railway" in tags:
                        category = "Transit & Metro Hubs"
                    if "building" in tags and tags["building"] in ("commercial", "office"):
                        category = "Tech & Corporate Parks"

                    impact = "High" if dist < 1.0 else "Medium"

                    anchors.append({
                        "osm_id": str(el.get("id", "")),
                        "name": name,
                        "category": category,
                        "lat": e_lat,
                        "lng": e_lng,
                        "distance_km": dist,
                        "impact_level": impact,
                    })

                logger.info(f"Overpass POI: found {len(anchors)} anchors near ({lat}, {lng})")
    except Exception as e:
        logger.warning(f"Overpass POI crawl failed: {e}")

    return anchors


# ─────────────────────────────────────────────
#  Unified Smart Crawl (On-Demand + Cache)
# ─────────────────────────────────────────────

async def ensure_competitor_data(
    lat: float, lng: float, locality: str, city: str, category_name: str
) -> List[Dict[str, Any]]:
    """
    Smart loader: returns cached data if fresh, otherwise crawls and caches.
    Priority: Google Places API (ratings + reviews) → Overpass fallback (names + locations).
    """
    v_key = _normalize_vertical_key(category_name)

    # Check cache first
    if is_competitor_data_fresh(locality, city, v_key):
        cached = load_competitors(locality, city, v_key)
        if cached:
            logger.info(f"Cache hit: {len(cached)} competitors for {v_key} in {locality}")
            return cached

    logger.info(f"Cache miss: crawling competitors for {v_key} in {locality}, {city}")

    # Strategy: Try Google Places first (has ratings + reviews), fall back to Overpass
    competitors: List[Dict[str, Any]] = []

    if settings.GOOGLE_PLACES_API_KEY:
        competitors = await crawl_competitors_for_locality(lat, lng, category_name, fetch_reviews=True)

    # If Google Places didn't return enough, supplement with Overpass
    if len(competitors) < 5:
        overpass_results = await crawl_competitors_overpass(lat, lng, category_name)
        # Merge: avoid duplicates by name similarity
        existing_names = {c["name"].lower() for c in competitors}
        for oc in overpass_results:
            if oc["name"].lower() not in existing_names:
                competitors.append(oc)
                existing_names.add(oc["name"].lower())

    # Sort by distance
    competitors.sort(key=lambda x: x.get("distance_km", 99))

    # Save to cache
    if competitors:
        save_competitors(locality, city, v_key, competitors)
    else:
        logger.warning(f"No competitors found for {v_key} in {locality}, {city} — will use heuristic fallback")

    return competitors


async def ensure_poi_data(
    lat: float, lng: float, locality: str, city: str
) -> List[Dict[str, Any]]:
    """
    Smart loader for POI anchors: returns cached if fresh, otherwise crawls Overpass.
    """
    if is_poi_data_fresh(locality, city):
        cached = load_poi_anchors(locality, city)
        if cached:
            logger.info(f"Cache hit: {len(cached)} POI anchors for {locality}")
            return cached

    logger.info(f"Cache miss: crawling POI anchors for {locality}, {city}")
    anchors = await crawl_poi_anchors_overpass(lat, lng)

    if anchors:
        save_poi_anchors(locality, city, anchors)

    return anchors


async def refresh_stale_data():
    """
    Background refresh: re-crawls localities where data is older than 7 days.
    Designed to be called by a scheduled task (APScheduler or cron).
    """
    stale_competitors = get_stale_entries("competitors", max_age_days=7)
    stale_pois = get_stale_entries("poi", max_age_days=14)

    logger.info(f"Stale refresh: {len(stale_competitors)} competitor entries, {len(stale_pois)} POI entries")

    # We would need coordinates for each locality. For now, we rely on the geocoding cache.
    # In production, store center coordinates in crawl_status table.
    # This is a placeholder for the background refresh logic.
    return {
        "stale_competitors": len(stale_competitors),
        "stale_pois": len(stale_pois),
        "status": "refresh_queued",
    }
