from fastapi import APIRouter, Query
from typing import List, Dict, Any
from ..services.geocoding import search_popular_locations, reverse_geocode
from ..models.schemas import BusinessCategory

router = APIRouter(prefix="/search", tags=["Search & Autocomplete"])

@router.get("/locations", response_model=List[Dict[str, str]])
async def get_locations(q: str = Query("", description="Locality, sub-locality, or city query")):
    """Returns autocomplete suggestions for Indian micro-markets, sub-localities, and pin codes."""
    return search_popular_locations(q)

@router.get("/reverse")
async def get_reverse_location(
    lat: float = Query(..., description="Latitude from GPS"),
    lng: float = Query(..., description="Longitude from GPS"),
) -> Dict[str, Any]:
    """Reverse geocodes GPS coordinates into locality, city, pincode, and formatted address."""
    loc = await reverse_geocode(lat, lng)
    return {
        "locality": loc.locality,
        "city": loc.city,
        "state": loc.state,
        "pincode": loc.pincode,
        "formatted_address": loc.formatted_address,
        "coordinates": {"lat": loc.coordinates.lat, "lng": loc.coordinates.lng},
    }

@router.get("/categories")
async def get_categories() -> List[Dict[str, Any]]:
    """Returns supported business categories with default Capex and typical space profiles."""
    return [
        {
            "id": "coffee",
            "title": "Specialty Coffee Shop & Cafe",
            "typical_capex": "₹15L – ₹35L",
            "typical_sqft": "800 – 1,200 sq.ft",
            "icon": "Coffee"
        },
        {
            "id": "dental",
            "title": "Dental Clinic & Diagnostics",
            "typical_capex": "₹20L – ₹50L",
            "typical_sqft": "700 – 1,100 sq.ft",
            "icon": "Stethoscope"
        },
        {
            "id": "salon",
            "title": "Unisex Salon & Luxury Spa",
            "typical_capex": "₹18L – ₹40L",
            "typical_sqft": "1,000 – 1,500 sq.ft",
            "icon": "Scissors"
        },
        {
            "id": "cloud_kitchen",
            "title": "Cloud Kitchen / QSR Hub",
            "typical_capex": "₹10L – ₹25L",
            "typical_sqft": "500 – 800 sq.ft",
            "icon": "ChefHat"
        },
        {
            "id": "gym",
            "title": "Functional Gym & Fitness Studio",
            "typical_capex": "₹25L – ₹60L",
            "typical_sqft": "2,500 – 4,500 sq.ft",
            "icon": "Dumbbell"
        },
        {
            "id": "pharmacy",
            "title": "Retail Pharmacy & Chemist",
            "typical_capex": "₹12L – ₹30L",
            "typical_sqft": "400 – 700 sq.ft",
            "icon": "Pill"
        },
        {
            "id": "bakery",
            "title": "Artisanal Bakery & Patisserie",
            "typical_capex": "₹15L – ₹30L",
            "typical_sqft": "600 – 1,000 sq.ft",
            "icon": "Cake"
        },
        {
            "id": "pet_care",
            "title": "Pet Clinic & Grooming Lounge",
            "typical_capex": "₹15L – ₹35L",
            "typical_sqft": "800 – 1,200 sq.ft",
            "icon": "PawPrint"
        },
        {
            "id": "coworking",
            "title": "Boutique Coworking Space",
            "typical_capex": "₹35L – ₹70L",
            "typical_sqft": "3,000 – 6,000 sq.ft",
            "icon": "Briefcase"
        },
        {
            "id": "restaurant",
            "title": "Fine Casual Dine-In Restaurant",
            "typical_capex": "₹35L – ₹80L",
            "typical_sqft": "1,800 – 3,000 sq.ft",
            "icon": "Utensils"
        },
        {
            "id": "apparel",
            "title": "Boutique Fashion & Designer Wear",
            "typical_capex": "₹20L – ₹45L",
            "typical_sqft": "800 – 1,500 sq.ft",
            "icon": "ShoppingBag"
        },
        {
            "id": "optician",
            "title": "Eyewear Store & Optometry",
            "typical_capex": "₹15L – ₹35L",
            "typical_sqft": "500 – 800 sq.ft",
            "icon": "Glasses"
        },
        {
            "id": "diagnostics",
            "title": "Pathology & Diagnostic Lab",
            "typical_capex": "₹25L – ₹55L",
            "typical_sqft": "800 – 1,400 sq.ft",
            "icon": "Microscope"
        },
        {
            "id": "preschool",
            "title": "Preschool & Early Daycare",
            "typical_capex": "₹20L – ₹45L",
            "typical_sqft": "2,000 – 4,000 sq.ft",
            "icon": "Baby"
        },
        {
            "id": "auto_detailing",
            "title": "Automobile Detailing & Ceramic Studio",
            "typical_capex": "₹18L – ₹40L",
            "typical_sqft": "1,500 – 2,500 sq.ft",
            "icon": "Car"
        },
        {
            "id": "organic_grocery",
            "title": "Organic Grocery & Gourmet Mart",
            "typical_capex": "₹20L – ₹50L",
            "typical_sqft": "1,000 – 2,000 sq.ft",
            "icon": "Apple"
        },
        {
            "id": "microbrewery",
            "title": "Microbrewery & Craft Beer Taproom",
            "typical_capex": "₹60L – ₹1.5Cr",
            "typical_sqft": "3,000 – 6,000 sq.ft",
            "icon": "Beer"
        },
        {
            "id": "icecream_dessert",
            "title": "Artisanal Ice Cream & Dessert Parlor",
            "typical_capex": "₹12L – ₹25L",
            "typical_sqft": "400 – 800 sq.ft",
            "icon": "IceCream"
        }
    ]
