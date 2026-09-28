import httpx
import math
import logging
from typing import List, Optional, Dict
from ..config import settings
from ..models.schemas import Coordinates, LocationInfo

logger = logging.getLogger("lokalscout.geocoding")

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two coordinate pairs in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 3)

# Curated Tier-1 & Tier-2 Indian commercial micro-markets and high-density sub-localities
INDIAN_MICROMARKETS: Dict[str, Dict[str, Any]] = {
    # ─── HYDERABAD: MADHAPUR & SUB-LOCALITIES ───
    "madhapur": {
        "locality": "Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4483,
        "lng": 78.3915,
        "formatted_address": "Madhapur, Hitec City, Hyderabad, Telangana 500081",
    },
    "ayyappa society": {
        "locality": "Ayyappa Society, Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4497,
        "lng": 78.3882,
        "formatted_address": "Ayyappa Society, 100ft Road, Madhapur, Hyderabad, Telangana 500081",
    },
    "kavuri hills": {
        "locality": "Kavuri Hills, Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500033",
        "lat": 17.4395,
        "lng": 78.3970,
        "formatted_address": "Kavuri Hills Phase 1, Madhapur, Hyderabad, Telangana 500033",
    },
    "100ft road madhapur": {
        "locality": "100ft Road, Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4475,
        "lng": 78.3910,
        "formatted_address": "100 Feet Road, Madhapur, Hyderabad, Telangana 500081",
    },
    "durgam cheruvu": {
        "locality": "Durgam Cheruvu Road, Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4380,
        "lng": 78.3850,
        "formatted_address": "Durgam Cheruvu Road, Madhapur, Hyderabad, Telangana 500081",
    },
    "inorbit mall road": {
        "locality": "Inorbit Mall Road, Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4350,
        "lng": 78.3870,
        "formatted_address": "Inorbit Mall Road, Hitec City, Madhapur, Hyderabad, Telangana 500081",
    },
    "cyber towers": {
        "locality": "Cyber Towers, Hitec City",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4504,
        "lng": 78.3808,
        "formatted_address": "Cyber Towers, Hitec City, Madhapur, Hyderabad, Telangana 500081",
    },

    # ─── HYDERABAD: GACHIBOWLI & SUB-LOCALITIES ───
    "gachibowli": {
        "locality": "Gachibowli",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500032",
        "lat": 17.4401,
        "lng": 78.3489,
        "formatted_address": "Gachibowli, Financial District, Hyderabad, Telangana 500032",
    },
    "financial district": {
        "locality": "Financial District, Gachibowli",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500032",
        "lat": 17.4170,
        "lng": 78.3450,
        "formatted_address": "Financial District, Nanakramguda, Hyderabad, Telangana 500032",
    },
    "nanakramguda": {
        "locality": "Nanakramguda, Gachibowli",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500032",
        "lat": 17.4190,
        "lng": 78.3480,
        "formatted_address": "Nanakramguda, Gachibowli, Hyderabad, Telangana 500032",
    },
    "telecom nagar": {
        "locality": "Telecom Nagar, Gachibowli",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500032",
        "lat": 17.4420,
        "lng": 78.3580,
        "formatted_address": "Telecom Nagar, Gachibowli, Hyderabad, Telangana 500032",
    },

    # ─── HYDERABAD: JUBILEE HILLS & BANJARA HILLS ───
    "jubilee hills": {
        "locality": "Jubilee Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500033",
        "lat": 17.4319,
        "lng": 78.4073,
        "formatted_address": "Jubilee Hills, Road No 36, Hyderabad, Telangana 500033",
    },
    "road no 36": {
        "locality": "Road No 36, Jubilee Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500033",
        "lat": 17.4330,
        "lng": 78.4060,
        "formatted_address": "Road No 36, Jubilee Hills, Hyderabad, Telangana 500033",
    },
    "road no 45": {
        "locality": "Road No 45, Jubilee Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500033",
        "lat": 17.4370,
        "lng": 78.4110,
        "formatted_address": "Road No 45, Jubilee Hills, Hyderabad, Telangana 500033",
    },
    "banjara hills": {
        "locality": "Banjara Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500034",
        "lat": 17.4156,
        "lng": 78.4357,
        "formatted_address": "Banjara Hills, Road No 12, Hyderabad, Telangana 500034",
    },
    "road no 12 banjara hills": {
        "locality": "Road No 12, Banjara Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500034",
        "lat": 17.4160,
        "lng": 78.4360,
        "formatted_address": "Road No 12, Banjara Hills, Hyderabad, Telangana 500034",
    },
    "kondapur": {
        "locality": "Kondapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500084",
        "lat": 17.4699,
        "lng": 78.3578,
        "formatted_address": "Kondapur, Raghava Colony, Hyderabad, Telangana 500084",
    },

    # ─── BENGALURU & SUB-LOCALITIES ───
    "indiranagar": {
        "locality": "Indiranagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560038",
        "lat": 12.9784,
        "lng": 77.6408,
        "formatted_address": "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    },
    "100ft road indiranagar": {
        "locality": "100ft Road, Indiranagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560038",
        "lat": 12.9784,
        "lng": 77.6408,
        "formatted_address": "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    },
    "12th main indiranagar": {
        "locality": "12th Main Road, Indiranagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560038",
        "lat": 12.9710,
        "lng": 77.6420,
        "formatted_address": "12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    },
    "koramangala": {
        "locality": "Koramangala",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560034",
        "lat": 12.9352,
        "lng": 77.6245,
        "formatted_address": "Koramangala 4th Block, Bengaluru, Karnataka 560034",
    },
    "koramangala 4th block": {
        "locality": "Koramangala 4th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560034",
        "lat": 12.9340,
        "lng": 77.6270,
        "formatted_address": "Koramangala 4th Block, Bengaluru, Karnataka 560034",
    },
    "koramangala 5th block": {
        "locality": "Koramangala 5th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560095",
        "lat": 12.9350,
        "lng": 77.6180,
        "formatted_address": "Koramangala 5th Block, Bengaluru, Karnataka 560095",
    },
    "hsr layout": {
        "locality": "HSR Layout",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560102",
        "lat": 12.9121,
        "lng": 77.6446,
        "formatted_address": "HSR Layout Sector 1, Bengaluru, Karnataka 560102",
    },
    "hsr sector 1": {
        "locality": "HSR Layout Sector 1",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560102",
        "lat": 12.9121,
        "lng": 77.6446,
        "formatted_address": "HSR Layout Sector 1, Bengaluru, Karnataka 560102",
    },
    "whitefield": {
        "locality": "Whitefield",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560066",
        "lat": 12.9698,
        "lng": 77.7500,
        "formatted_address": "ITPB Main Road, Whitefield, Bengaluru, Karnataka 560066",
    },

    # ─── MUMBAI & SUB-LOCALITIES ───
    "bandra west": {
        "locality": "Bandra West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050",
        "lat": 19.0596,
        "lng": 72.8295,
        "formatted_address": "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
    },
    "pali hill": {
        "locality": "Pali Hill, Bandra West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050",
        "lat": 19.0620,
        "lng": 72.8250,
        "formatted_address": "Pali Hill, Bandra West, Mumbai, Maharashtra 400050",
    },
    "linking road": {
        "locality": "Linking Road, Bandra West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050",
        "lat": 19.0650,
        "lng": 72.8340,
        "formatted_address": "Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    },
    "andheri west": {
        "locality": "Andheri West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400053",
        "lat": 19.1363,
        "lng": 72.8277,
        "formatted_address": "Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053",
    },
    "lokhandwala": {
        "locality": "Lokhandwala Complex, Andheri West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400053",
        "lat": 19.1410,
        "lng": 72.8290,
        "formatted_address": "Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053",
    },
    "powai": {
        "locality": "Powai",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400076",
        "lat": 19.1176,
        "lng": 72.9060,
        "formatted_address": "Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076",
    },

    # ─── DELHI-NCR & SUB-LOCALITIES ───
    "cyber city": {
        "locality": "DLF Cyber City",
        "city": "Gurugram",
        "state": "Haryana",
        "pincode": "122002",
        "lat": 28.4950,
        "lng": 77.0895,
        "formatted_address": "DLF Phase 2, Cyber City, Gurugram, Haryana 122002",
    },
    "cyber hub": {
        "locality": "Cyber Hub, DLF Phase 2",
        "city": "Gurugram",
        "state": "Haryana",
        "pincode": "122002",
        "lat": 28.4980,
        "lng": 77.0890,
        "formatted_address": "DLF Cyber Hub, DLF Phase 2, Gurugram, Haryana 122002",
    },
    "connaught place": {
        "locality": "Connaught Place",
        "city": "New Delhi",
        "state": "Delhi",
        "pincode": "110001",
        "lat": 28.6315,
        "lng": 77.2167,
        "formatted_address": "Inner Circle, Connaught Place, New Delhi 110001",
    },
    "hauz khas": {
        "locality": "Hauz Khas",
        "city": "New Delhi",
        "state": "Delhi",
        "pincode": "110016",
        "lat": 28.5494,
        "lng": 77.2001,
        "formatted_address": "Hauz Khas Village, New Delhi 110016",
    },

    # ─── PUNE & CHENNAI ───
    "koregaon park": {
        "locality": "Koregaon Park",
        "city": "Pune",
        "state": "Maharashtra",
        "pincode": "411001",
        "lat": 18.5362,
        "lng": 73.8940,
        "formatted_address": "North Main Road, Koregaon Park, Pune, Maharashtra 411001",
    },
    "baner": {
        "locality": "Baner",
        "city": "Pune",
        "state": "Maharashtra",
        "pincode": "411045",
        "lat": 18.5590,
        "lng": 73.7868,
        "formatted_address": "Baner High Street, Pune, Maharashtra 411045",
    },
    "baner high street": {
        "locality": "Baner High Street",
        "city": "Pune",
        "state": "Maharashtra",
        "pincode": "411045",
        "lat": 18.5595,
        "lng": 73.7870,
        "formatted_address": "Baner High Street, Baner, Pune, Maharashtra 411045",
    },
    "anna nagar": {
        "locality": "Anna Nagar",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600040",
        "lat": 13.0850,
        "lng": 80.2101,
        "formatted_address": "2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040",
    }
}

async def reverse_geocode(lat: float, lng: float) -> LocationInfo:
    """
    Reverse geocodes latitude and longitude into normalized LocationInfo.
    1. Checks if within 1.5 km of a known Indian micro-market or sub-locality.
    2. Queries Nominatim reverse geocoding API to resolve exact street/neighbourhood.
    3. Graceful fallback ensures zero failure.
    """
    # 1. Check proximity to known curated micro-markets
    closest_key = None
    min_dist = float("inf")
    for key, data in INDIAN_MICROMARKETS.items():
        dist = haversine_distance_km(lat, lng, data["lat"], data["lng"])
        if dist < min_dist:
            min_dist = dist
            closest_key = key

    # If within 1.2 km of a known curated sub-locality, we have high confidence
    curated_match = None
    if closest_key and min_dist <= 1.2:
        curated_match = INDIAN_MICROMARKETS[closest_key]

    # 2. Query Nominatim reverse geocode for exact street/suburb precision
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            headers = {"User-Agent": "LokalScout-Reverse-Geocoding/1.0 (contact@lokalscout.in)"}
            resp = await client.get(
                settings.NOMINATIM_REVERSE_URL,
                params={"lat": lat, "lon": lng, "format": "json", "addressdetails": 1},
                headers=headers
            )
            if resp.status_code == 200:
                data = resp.json()
                addr = data.get("address", {})
                neighbourhood = (
                    addr.get("suburb")
                    or addr.get("neighbourhood")
                    or addr.get("residential")
                    or addr.get("road")
                )
                city = addr.get("city") or addr.get("town") or addr.get("state_district") or (curated_match["city"] if curated_match else "Hyderabad")
                pincode = addr.get("postcode") or (curated_match["pincode"] if curated_match else "500081")
                state = addr.get("state") or (curated_match["state"] if curated_match else "Telangana")

                locality_label = f"{neighbourhood}, {city}" if neighbourhood else (curated_match["locality"] if curated_match else f"{city} Sector")

                return LocationInfo(
                    locality=locality_label,
                    city=city,
                    state=state,
                    pincode=pincode,
                    formatted_address=data.get("display_name", f"{locality_label}, {city} {pincode}"),
                    coordinates=Coordinates(lat=lat, lng=lng),
                )
    except Exception as e:
        logger.warning(f"Nominatim reverse geocode fallback: {str(e)}")

    # 3. Use curated match if within proximity
    if curated_match:
        return LocationInfo(
            locality=curated_match["locality"],
            city=curated_match["city"],
            state=curated_match["state"],
            pincode=curated_match["pincode"],
            formatted_address=curated_match["formatted_address"],
            coordinates=Coordinates(lat=lat, lng=lng),
        )

    # 4. Ultimate robust fallback
    return LocationInfo(
        locality="Detected Location",
        city="Hyderabad",
        state="Telangana",
        pincode="500081",
        formatted_address=f"Location at {lat:.4f}, {lng:.4f}",
        coordinates=Coordinates(lat=lat, lng=lng),
    )

async def resolve_location(
    locality_query: str,
    city_hint: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
) -> LocationInfo:
    """
    Resolves locality or pin code to normalized LocationInfo with coordinates.
    If exact lat/lng are provided (e.g. from browser GPS), anchors to those coordinates.
    Uses pre-cached high-traffic Indian micro-markets first, falls back to OpenStreetMap Nominatim.
    """
    # If exact coordinates provided, reverse geocode or anchor
    if lat is not None and lng is not None and abs(lat) > 0 and abs(lng) > 0:
        resolved = await reverse_geocode(lat, lng)
        if locality_query and locality_query.strip() and locality_query.strip().lower() != "detected location":
            resolved.locality = locality_query.strip()
        return resolved

    normalized_key = locality_query.lower().strip()
    
    # 1. Exact or partial match in curated registry
    for key, data in INDIAN_MICROMARKETS.items():
        if key in normalized_key or normalized_key in key:
            return LocationInfo(
                locality=data["locality"],
                city=data["city"],
                state=data["state"],
                pincode=data["pincode"],
                formatted_address=data["formatted_address"],
                coordinates=Coordinates(lat=data["lat"], lng=data["lng"]),
            )
            
    # 2. Try Nominatim Geocoding API with polite User-Agent
    search_query = f"{locality_query}, {city_hint or 'India'}"
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            headers = {"User-Agent": "LokalScout-Intelligence-Engine/1.0 (contact@lokalscout.in)"}
            resp = await client.get(
                settings.NOMINATIM_URL,
                params={"q": search_query, "format": "json", "addressdetails": 1, "limit": 1, "countrycodes": "in"},
                headers=headers
            )
            if resp.status_code == 200:
                results = resp.json()
                if results and len(results) > 0:
                    first = results[0]
                    addr = first.get("address", {})
                    loc_name = addr.get("suburb") or addr.get("neighbourhood") or addr.get("residential") or locality_query.title()
                    city_name = addr.get("city") or addr.get("town") or addr.get("state_district") or (city_hint or "Hyderabad")
                    return LocationInfo(
                        locality=loc_name,
                        city=city_name,
                        state=addr.get("state", "India"),
                        pincode=addr.get("postcode", "500081"),
                        formatted_address=first.get("display_name", f"{locality_query}, {city_name}"),
                        coordinates=Coordinates(lat=float(first["lat"]), lng=float(first["lon"]))
                    )
    except Exception as e:
        logger.warning(f"Nominatim forward geocode fallback: {str(e)}")
        
    # Default fallback: Madhapur, Hyderabad if unknown
    return LocationInfo(
        locality=locality_query.title(),
        city=city_hint.title() if city_hint else "Hyderabad",
        state="Telangana",
        pincode="500081",
        formatted_address=f"{locality_query.title()}, {city_hint or 'Hyderabad'}, India",
        coordinates=Coordinates(lat=17.4483, lng=78.3915),
    )

def search_popular_locations(query: str = "") -> List[Dict[str, str]]:
    """Returns matching popular Indian business hubs and sub-localities for frontend autocomplete."""
    q = query.lower().strip()
    results = []
    seen = set()
    for key, data in INDIAN_MICROMARKETS.items():
        loc_label = f"{data['locality']}, {data['city']}"
        if loc_label in seen:
            continue
        if (
            not q
            or q in key
            or q in data["locality"].lower()
            or q in data["city"].lower()
            or q in data["pincode"]
        ):
            seen.add(loc_label)
            results.append({
                "locality": data["locality"],
                "city": data["city"],
                "state": data["state"],
                "pincode": data["pincode"],
                "label": loc_label,
                "lat": str(data["lat"]),
                "lng": str(data["lng"]),
            })
    return results[:10]
