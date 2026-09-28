from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class BusinessCategory(str, Enum):
    COFFEE_SHOP = "Specialty Coffee Shop & Cafe"
    DENTAL_CLINIC = "Dental Clinic & Diagnostics"
    UNISEX_SALON = "Unisex Salon & Luxury Spa"
    CLOUD_KITCHEN = "Cloud Kitchen / QSR Hub"
    FITNESS_GYM = "Functional Gym & Fitness Studio"
    PHARMACY = "Retail Pharmacy & Chemist"
    BAKERY = "Artisanal Bakery & Patisserie"
    PET_CARE = "Pet Clinic & Grooming Lounge"
    COWORKING = "Boutique Coworking Space"
    RESTAURANT = "Fine Casual Dine-In Restaurant"

class ViabilityClassification(str, Enum):
    BLUE_OCEAN = "Blue Ocean (High Demand, Low Saturation)"
    HIGH_DEMAND_HIGH_COMPETITION = "High Demand, High Competition (Prime Battleground)"
    UNDERSERVED_NICHE = "Underserved Niche (Specialized Potential)"
    OVER_SATURATED = "Over-Saturated (High Failure Risk)"

class Coordinates(BaseModel):
    lat: float
    lng: float

class LocationInfo(BaseModel):
    locality: str
    city: str
    state: str = "India"
    pincode: Optional[str] = None
    formatted_address: str
    coordinates: Coordinates

class CompetitorItem(BaseModel):
    name: str
    rating: float
    reviews_count: int
    address: str
    distance_km: float
    price_tier: str = "Mid-Range"  # Budget, Mid-Range, Premium
    primary_strengths: List[str] = Field(default_factory=list)
    common_complaints: List[str] = Field(default_factory=list)

class CompetitorAnalysis(BaseModel):
    total_competitors_2km: int
    total_competitors_5km: int
    saturation_score: int = Field(ge=0, le=100) # 0 = no competition, 100 = intense
    avg_rating: float
    top_competitors: List[CompetitorItem]
    price_distribution: Dict[str, int] # e.g. {"Budget": 20, "Mid-Range": 55, "Premium": 25}
    top_customer_complaints: List[str] # recurrent negative points from competitors

class DemandAnchor(BaseModel):
    category: str # "Colleges & Youth", "Tech & Corporate Parks", "Shopping Malls", "Transit Stations", "Residential Clusters"
    name: str
    distance_km: float
    impact_level: str = "High" # High, Medium, Moderate

class DemandAnchorsAnalysis(BaseModel):
    anchors: List[DemandAnchor]
    summary: str
    footfall_density_rating: str = "High" # Very High, High, Moderate, Developing

class CommuteWindow(BaseModel):
    time_window: str # e.g., "08:00 AM - 11:30 AM"
    label: str # e.g., "Morning Tech Commute"
    intensity_score: int # 1 - 100
    dominant_demographic: str # e.g. "Tech Professionals & Students"

class SearchIntentTrend(BaseModel):
    keyword: str
    monthly_searches: int
    growth_yoy: str
    commercial_intent: str # "Very High", "High", "Informational"

class RealEstateBenchmark(BaseModel):
    main_road_rent_sqft_monthly: int # e.g., 110 INR/sqft
    inner_lane_rent_sqft_monthly: int # e.g., 65 INR/sqft
    security_deposit_months: int # e.g., 6 months
    typical_carpet_area_sqft: int # e.g., 1200 sqft
    monthly_rental_estimate_main_road: int
    monthly_rental_estimate_inner_lane: int
    escalation_rate_annual_pct: float = 5.0

class BreakEvenCalculator(BaseModel):
    estimated_capex: int
    monthly_rent: int
    monthly_staff_payroll: int
    monthly_utilities_and_misc: int
    cogs_percentage: float # e.g. 30%
    average_order_value_inr: int
    required_daily_customers: int
    monthly_breakeven_revenue: int
    payback_period_months: int
    margin_of_safety_pct: float

class StrategicGap(BaseModel):
    opportunity_title: str
    description: str
    why_it_works: str

class WalkshedBarrier(BaseModel):
    barrier_type: str  # "Divided Expressway", "Metro Line Viaduct", "Railway Track", "Gated Township"
    description: str
    pedestrian_friction: str  # "High Friction", "Moderate Friction"

class IsochroneWalkshed(BaseModel):
    five_min_walk_meters: int  # e.g. 380 meters
    ten_min_walk_meters: int   # e.g. 780 meters
    fifteen_min_walk_meters: int # e.g. 1250 meters
    pedestrian_permeability_score: int # 0 to 100
    barrier_warnings: List[WalkshedBarrier]
    catchment_pop_5min: int
    catchment_pop_10min: int
    footfall_retention_index: str # "Very High", "High", "Moderate"

class HourlyFootfallPoint(BaseModel):
    hour_label: str # "08:00 AM", "09:00 AM", etc.
    hour_24: int    # 8, 9, ...
    footfall_index: int # 0 to 100
    dominant_demographic: str # "Tech Commuters", "Corporate Lunch", "Family Dinner", "Late-Night Delivery"
    recommended_staff_count: int

class DaypartingProfile(BaseModel):
    peak_hours: List[str]
    hourly_curve: List[HourlyFootfallPoint]
    shift_recommendation: Dict[str, str]
    revenue_concentration_pct_peak: int

class FitOutBudgetBreakdown(BaseModel):
    carpet_area_sqft: int
    civil_and_flooring: int
    hvac_and_electrical: int
    furniture_and_fixtures: int
    branding_and_facade: int
    total_estimated_fitout_capex: int
    cost_per_sqft: int
    estimated_turnaround_days: int

class GoogleSandboxPreview(BaseModel):
    business_name_mock: str
    category_label: str
    star_rating: float = 4.9
    review_count_projected: int = 94
    opening_status: str = "Opening Soon in 45 Days"
    launch_voucher: str = "Claim 20% Off Launch Pass"
    google_3pack_rank_projected: int = 1
    unoptimized_rank_baseline: int = 14

class PropertyMatchCandidate(BaseModel):
    property_id: str
    title: str
    carpet_area_sqft: int
    floor: str
    rent_monthly_inr: int
    brokerage_fee: str = "Zero Brokerage (Direct Landlord)"
    distance_from_anchor_m: int
    verified: bool = True

class WatchdogAlert(BaseModel):
    alert_id: str
    timestamp: str
    competitor_name: str
    distance_m: int
    event_type: str # "New Competitor Opening", "Trade License Registered", "Significant Price Change", "Rating Drop Spike"
    severity: str # "High Attention", "Moderate Impact", "Informational"
    summary: str
    recommended_counter_move: str

class WatchdogSubscriptionRequest(BaseModel):
    email: str
    phone: Optional[str] = None
    locality: str
    pincode: str
    category: str
    notification_channel: str = "email_and_whatsapp"

class WatchdogSubscriptionResponse(BaseModel):
    subscription_id: str
    status: str = "active"
    pincode: str
    locality: str
    category: str
    monitored_radius_km: float = 2.0
    active_alerts_count: int
    latest_alerts: List[WatchdogAlert]
    next_audit_date: str

class LaunchActionPlan(BaseModel):
    week_1_to_2: str
    week_3_to_4: str
    week_5_to_8: str
    growlokal_offer_code: str = "LOKALSCOUT1000"
    growlokal_offer_details: str = "Claim ₹1,000 credit towards GrowLokal Autopilot (Google Maps 3-Pack, Launch Site & WhatsApp Funnel)."

# The 10-Section Complete Dossier Model
class FeasibilityReport(BaseModel):
    report_id: str
    business_vertical: str
    location: LocationInfo
    generated_at: str
    
    # 1. Executive Feasibility Scorecard
    overall_score: int = Field(ge=0, le=100)
    viability_status: ViabilityClassification
    risk_rating: str # "Low", "Moderate", "High", "Critical"
    confidence_index: int = Field(default=94, ge=0, le=100)
    executive_verdict: str
    unfair_advantages: List[str]
    
    # 2. Competitor Saturation Map & List
    competitor_analysis: CompetitorAnalysis
    
    # 3. Price Tier & Offering Distribution
    price_tier_analysis: Dict[str, Any]
    
    # 4. Footfall & Demand Anchors
    demand_anchors: DemandAnchorsAnalysis
    
    # 5. Peak Commute & Activity Windows
    peak_windows: List[CommuteWindow]
    
    # 6. Local Search Intent & Demand Signals
    search_intent: List[SearchIntentTrend]
    
    # 7. Commercial Real Estate Benchmarks
    real_estate: RealEstateBenchmark
    
    # 8. Financial Break-Even Calculator
    break_even: BreakEvenCalculator
    
    # 9. Competitor Weakness & Strategic Gaps
    strategic_gaps: List[StrategicGap]
    
    # 10. The Launch Action Plan (GrowLokal Flywheel)
    launch_action_plan: LaunchActionPlan
    
    # Enhanced Modules (Walkshed, Dayparting, Fit-Out & Sandbox)
    isochrone_walkshed: Optional[IsochroneWalkshed] = None
    dayparting_profile: Optional[DaypartingProfile] = None
    fitout_estimator: Optional[FitOutBudgetBreakdown] = None
    google_sandbox: Optional[GoogleSandboxPreview] = None
    matched_properties: Optional[List[PropertyMatchCandidate]] = None
    
    # Unlock state
    is_unlocked: bool = False

# Free Teaser Summary (Sections 1-2 only, plus teaser pointers)
class FeasibilityPreview(BaseModel):
    report_id: str
    business_vertical: str
    locality: str
    city: str
    overall_score: int
    viability_status: ViabilityClassification
    risk_rating: str
    competitor_count_2km: int
    top_3_anchors: List[str]
    executive_teaser_snippet: str
    unlock_price_inr: int = 799

# Request Models
class FeasibilityRequest(BaseModel):
    category: str
    locality: str
    city: Optional[str] = None
    pincode: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class ComparisonRequest(BaseModel):
    category: str
    localities: List[str] # List of 2 to 3 localities (e.g. ["Madhapur", "Gachibowli", "Jubilee Hills"])

class ComparisonItem(BaseModel):
    locality: str
    overall_score: int
    viability_status: str
    competitor_count: int
    avg_rent_sqft: int
    daily_footfall_score: int
    recommended_positioning: str
    verdict: str

class AreaComparisonReport(BaseModel):
    category: str
    items: List[ComparisonItem]
    winner_locality: str
    winner_rationale: str
    summary_matrix: Dict[str, Any]
