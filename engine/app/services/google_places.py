"""
Google Places API (New) client for LokalScout.
Uses the $200/month free credit on Google Cloud Platform.

Fetches real competitor names, ratings, review counts, and review text
for any given locality + business vertical combination.
"""

import httpx
import math
import logging
from typing import List, Dict, Any, Optional
from ..config import settings

logger = logging.getLogger("lokalscout.google_places")

# Google Places API (New) endpoints
NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby"
PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places"

# Map our business verticals to Google Places API types
# See: https://developers.google.com/maps/documentation/places/web-service/place-types
VERTICAL_TO_GOOGLE_TYPES: Dict[str, List[str]] = {
    "coffee": ["cafe", "coffee_shop"],
    "dental": ["dentist", "dental_clinic"],
    "salon": ["beauty_salon", "hair_salon", "spa"],
    "cloud_kitchen": ["restaurant", "meal_delivery"],
    "gym": ["gym", "fitness_center"],
    "pharmacy": ["pharmacy", "drugstore"],
    "bakery": ["bakery"],
}


def _normalize_vertical(category_name: str) -> str:
    """Maps user-facing category strings to our internal vertical keys."""
    norm = category_name.lower()
    if "dental" in norm or "clinic" in norm:
        return "dental"
    elif "salon" in norm or "spa" in norm or "beauty" in norm:
        return "salon"
    elif "cloud" in norm or "kitchen" in norm or "qsr" in norm:
        return "cloud_kitchen"
    elif "gym" in norm or "fitness" in norm:
        return "gym"
    elif "pharmacy" in norm or "chemist" in norm:
        return "pharmacy"
    elif "bakery" in norm or "patisserie" in norm:
        return "bakery"
    return "coffee"


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two points in km using Haversine formula."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def _estimate_price_tier(price_level: Optional[int]) -> str:
    """Converts Google's 0-4 PRICE_LEVEL to human-readable tier."""
    if price_level is None:
        return "Mid-Range"
    mapping = {0: "Budget", 1: "Budget", 2: "Mid-Range", 3: "Premium", 4: "Premium"}
    return mapping.get(price_level, "Mid-Range")


async def search_nearby_competitors(
    lat: float,
    lng: float,
    category_name: str,
    radius_m: int = 2000,
    max_results: int = 20,
) -> List[Dict[str, Any]]:
    """
    Uses Google Places API (New) Nearby Search to find real competitors.
    Returns list of competitor dicts with name, rating, review_count, address, lat/lng, distance.

    Cost: 1 request = ~$0.032 (within free $200/month credit).
    """
    if not settings.GOOGLE_PLACES_API_KEY:
        logger.warning("GOOGLE_PLACES_API_KEY not set — skipping Google Places search")
        return []

    v_key = _normalize_vertical(category_name)
    google_types = VERTICAL_TO_GOOGLE_TYPES.get(v_key, ["cafe"])

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.location,places.types",
    }

    payload = {
        "includedTypes": google_types,
        "maxResultCount": min(max_results, 20),  # API max is 20
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius_m),
            }
        },
        "rankPreference": "DISTANCE",
    }

    competitors = []
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(NEARBY_SEARCH_URL, json=payload, headers=headers)

            if resp.status_code == 200:
                data = resp.json()
                for place in data.get("places", []):
                    p_lat = place.get("location", {}).get("latitude")
                    p_lng = place.get("location", {}).get("longitude")
                    dist = _haversine_km(lat, lng, p_lat, p_lng) if p_lat and p_lng else 1.0

                    competitors.append({
                        "name": place.get("displayName", {}).get("text", "Unknown"),
                        "google_place_id": place.get("id"),
                        "lat": p_lat,
                        "lng": p_lng,
                        "google_rating": place.get("rating"),
                        "review_count": place.get("userRatingCount", 0),
                        "price_level": place.get("priceLevel"),
                        "price_tier": _estimate_price_tier(place.get("priceLevel")),
                        "address": place.get("formattedAddress", ""),
                        "distance_km": dist,
                        "source": "google_places",
                    })
                logger.info(f"Google Places: found {len(competitors)} competitors for '{category_name}' near ({lat}, {lng})")
            else:
                logger.warning(f"Google Places API error {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        logger.warning(f"Google Places API request failed: {e}")

    return competitors


async def fetch_place_reviews(
    place_id: str,
    max_reviews: int = 5,
) -> Dict[str, Any]:
    """
    Fetches detailed reviews for a specific place using Place Details (New).
    Returns dict with 'complaints' (1-3 star reviews) and 'strengths' (4-5 star reviews).

    Cost: 1 request = ~$0.017 (within free $200/month credit).
    """
    if not settings.GOOGLE_PLACES_API_KEY:
        return {"complaints": [], "strengths": []}

    url = f"{PLACE_DETAILS_URL}/{place_id}"
    headers = {
        "X-Goog-Api-Key": settings.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "reviews",
    }

    complaints = []
    strengths = []

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url, headers=headers)

            if resp.status_code == 200:
                data = resp.json()
                for review in data.get("reviews", [])[:max_reviews]:
                    rating = review.get("rating", 3)
                    text = review.get("text", {}).get("text", "").strip()
                    if not text:
                        continue

                    # Truncate very long reviews to the key complaint/praise
                    snippet = text[:200] + ("..." if len(text) > 200 else "")

                    if rating <= 3:
                        complaints.append(snippet)
                    else:
                        strengths.append(snippet)
    except Exception as e:
        logger.warning(f"Google Place Details request failed for {place_id}: {e}")

    return {"complaints": complaints, "strengths": strengths}


async def crawl_competitors_for_locality(
    lat: float,
    lng: float,
    category_name: str,
    fetch_reviews: bool = True,
) -> List[Dict[str, Any]]:
    """
    Full crawl pipeline: Nearby Search → (optional) Place Details for top competitors.
    Designed to be called once per locality+vertical, then cached in SQLite.
    """
    # Step 1: Find competitors via Nearby Search
    competitors = await search_nearby_competitors(lat, lng, category_name)

    if not competitors:
        return []

    # Step 2: Fetch reviews for top 5 competitors (to save API budget)
    if fetch_reviews:
        for comp in competitors[:5]:
            place_id = comp.get("google_place_id")
            if place_id:
                reviews = await fetch_place_reviews(place_id)
                comp["complaints"] = reviews["complaints"]
                comp["strengths"] = reviews["strengths"]

    return competitors
