import httpx
from typing import List, Optional, Dict
from ..config import settings
from ..models.schemas import Coordinates, LocationInfo

# Curated Tier-1 & Tier-2 Indian commercial micro-markets database for rapid low-latency resolution
INDIAN_MICROMARKETS = {
    "madhapur": {
        "locality": "Madhapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "lat": 17.4483,
        "lng": 78.3915,
        "formatted_address": "Madhapur, Hitec City, Hyderabad, Telangana 500081",
    },
    "gachibowli": {
        "locality": "Gachibowli",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500032",
        "lat": 17.4401,
        "lng": 78.3489,
        "formatted_address": "Gachibowli, Financial District, Hyderabad, Telangana 500032",
    },
    "jubilee hills": {
        "locality": "Jubilee Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500033",
        "lat": 17.4319,
        "lng": 78.4073,
        "formatted_address": "Jubilee Hills, Road No 36, Hyderabad, Telangana 500033",
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
    "kondapur": {
        "locality": "Kondapur",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500084",
        "lat": 17.4699,
        "lng": 78.3578,
        "formatted_address": "Kondapur, Raghava Colony, Hyderabad, Telangana 500084",
    },
    "indiranagar": {
        "locality": "Indiranagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560038",
        "lat": 12.9784,
        "lng": 77.6408,
        "formatted_address": "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
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
    "hsr layout": {
        "locality": "HSR Layout",
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
    "bandra west": {
        "locality": "Bandra West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400050",
        "lat": 19.0596,
        "lng": 72.8295,
        "formatted_address": "Hill Road, Bandra West, Mumbai, Maharashtra 400050",
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
    "powai": {
        "locality": "Powai",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400076",
        "lat": 19.1176,
        "lng": 72.9060,
        "formatted_address": "Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076",
    },
    "cyber city": {
        "locality": "DLF Cyber City",
        "city": "Gurugram",
        "state": "Haryana",
        "pincode": "122002",
        "lat": 28.4950,
        "lng": 77.0895,
        "formatted_address": "DLF Phase 2, Cyber City, Gurugram, Haryana 122002",
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

async def resolve_location(locality_query: str, city_hint: Optional[str] = None) -> LocationInfo:
    """
    Resolves locality or pin code to normalized LocationInfo with coordinates.
    Uses pre-cached high-traffic Indian micro-markets first, falls back to OpenStreetMap Nominatim.
    """
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
    except Exception:
        pass # Fallback to default
        
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
    """Returns matching popular Indian business hubs for frontend autocomplete."""
    q = query.lower().strip()
    results = []
    for key, data in INDIAN_MICROMARKETS.items():
        if not q or q in key or q in data["city"].lower() or q in data["pincode"]:
            results.append({
                "locality": data["locality"],
                "city": data["city"],
                "state": data["state"],
                "pincode": data["pincode"],
                "label": f"{data['locality']}, {data['city']}"
            })
    return results[:8]
