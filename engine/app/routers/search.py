from fastapi import APIRouter, Query
from typing import List, Dict, Any
from ..services.geocoding import search_popular_locations
from ..models.schemas import BusinessCategory

router = APIRouter(prefix="/search", tags=["Search & Autocomplete"])

@router.get("/locations", response_model=List[Dict[str, str]])
async def get_locations(q: str = Query("", description="Locality or city query")):
    """Returns autocomplete suggestions for Indian micro-markets and pin codes."""
    return search_popular_locations(q)

@router.get("/categories")
async def get_categories() -> List[Dict[str, Any]]:
    """Returns supported business categories with default Capex and typical space profiles."""
    return [
        {
            "id": "coffee",
            "title": BusinessCategory.COFFEE_SHOP.value,
            "typical_capex": "₹25L – ₹35L",
            "typical_sqft": "800 – 1,200 sq.ft",
            "icon": "Coffee"
        },
        {
            "id": "dental",
            "title": BusinessCategory.DENTAL_CLINIC.value,
            "typical_capex": "₹28L – ₹50L",
            "typical_sqft": "700 – 1,100 sq.ft",
            "icon": "Stethoscope"
        },
        {
            "id": "salon",
            "title": BusinessCategory.UNISEX_SALON.value,
            "typical_capex": "₹22L – ₹40L",
            "typical_sqft": "1,000 – 1,500 sq.ft",
            "icon": "Scissors"
        },
        {
            "id": "cloud_kitchen",
            "title": BusinessCategory.CLOUD_KITCHEN.value,
            "typical_capex": "₹12L – ₹22L",
            "typical_sqft": "500 – 800 sq.ft",
            "icon": "ChefHat"
        },
        {
            "id": "gym",
            "title": BusinessCategory.FITNESS_GYM.value,
            "typical_capex": "₹35L – ₹65L",
            "typical_sqft": "2,500 – 4,500 sq.ft",
            "icon": "Dumbbell"
        },
        {
            "id": "pharmacy",
            "title": BusinessCategory.PHARMACY.value,
            "typical_capex": "₹15L – ₹28L",
            "typical_sqft": "400 – 700 sq.ft",
            "icon": "Pill"
        },
        {
            "id": "bakery",
            "title": BusinessCategory.BAKERY.value,
            "typical_capex": "₹18L – ₹32L",
            "typical_sqft": "600 – 1,000 sq.ft",
            "icon": "Cake"
        }
    ]
