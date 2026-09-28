from typing import Dict, Any, Tuple
from ..models.schemas import RealEstateBenchmark, BreakEvenCalculator

# City & Locality commercial rental baseline (INR per sqft/month for main road commercial space)
RENT_BENCHMARKS: Dict[str, Dict[str, int]] = {
    "madhapur": {"main_road": 125, "inner_lane": 70, "deposit_months": 6},
    "gachibowli": {"main_road": 110, "inner_lane": 65, "deposit_months": 6},
    "jubilee hills": {"main_road": 190, "inner_lane": 115, "deposit_months": 9},
    "banjara hills": {"main_road": 175, "inner_lane": 105, "deposit_months": 9},
    "kondapur": {"main_road": 95, "inner_lane": 55, "deposit_months": 5},
    "indiranagar": {"main_road": 210, "inner_lane": 130, "deposit_months": 10},
    "koramangala": {"main_road": 185, "inner_lane": 110, "deposit_months": 10},
    "hsr layout": {"main_road": 135, "inner_lane": 80, "deposit_months": 8},
    "whitefield": {"main_road": 105, "inner_lane": 60, "deposit_months": 6},
    "bandra west": {"main_road": 380, "inner_lane": 230, "deposit_months": 10},
    "andheri west": {"main_road": 240, "inner_lane": 140, "deposit_months": 8},
    "powai": {"main_road": 195, "inner_lane": 120, "deposit_months": 8},
    "cyber city": {"main_road": 160, "inner_lane": 95, "deposit_months": 6},
    "connaught place": {"main_road": 320, "inner_lane": 190, "deposit_months": 9},
    "koregaon park": {"main_road": 150, "inner_lane": 90, "deposit_months": 6},
    "baner": {"main_road": 120, "inner_lane": 70, "deposit_months": 6},
    "anna nagar": {"main_road": 140, "inner_lane": 85, "deposit_months": 6},
}

# Vertical specific operational benchmarks in India
VERTICAL_BENCHMARKS: Dict[str, Dict[str, Any]] = {
    "coffee": {
        "typical_sqft": 1000,
        "typical_capex": 2800000, # 28 Lakhs (Espresso machine, interior, HVAC)
        "cogs_pct": 0.28,        # Coffee beans, milk, syrups, pastries
        "staff_count": 5,
        "monthly_staff_cost": 125000,
        "utilities_misc": 45000,
        "avg_ticket_size": 340,   # 1 coffee + snack average
    },
    "dental": {
        "typical_sqft": 850,
        "typical_capex": 3500000, # Dental chairs, RVG, autoclave, interiors
        "cogs_pct": 0.16,        # Consumables, gloves, lab fabrication
        "staff_count": 4,
        "monthly_staff_cost": 160000,
        "utilities_misc": 35000,
        "avg_ticket_size": 1850,  # Consultation + procedure blend
    },
    "salon": {
        "typical_sqft": 1200,
        "typical_capex": 3200000, # Styling stations, wash units, aesthetic fit-out
        "cogs_pct": 0.12,        # Color tubes, shampoos, treatments
        "staff_count": 7,
        "monthly_staff_cost": 210000,
        "utilities_misc": 55000,
        "avg_ticket_size": 950,
    },
    "cloud_kitchen": {
        "typical_sqft": 600,
        "typical_capex": 1600000, # Commercial burners, refrigeration, exhaust
        "cogs_pct": 0.34,        # Raw food ingredients + packaging
        "staff_count": 4,
        "monthly_staff_cost": 90000,
        "utilities_misc": 38000,
        "avg_ticket_size": 420,
    },
    "gym": {
        "typical_sqft": 3000,
        "typical_capex": 4800000, # Heavy commercial fitness rigs, flooring, audio
        "cogs_pct": 0.05,
        "staff_count": 6,
        "monthly_staff_cost": 180000,
        "utilities_misc": 75000,
        "avg_ticket_size": 2500,  # Monthly subscription amortized
    },
    "pharmacy": {
        "typical_sqft": 500,
        "typical_capex": 1800000, # Racks, cold storage, billing, initial stock
        "cogs_pct": 0.78,        # Drug purchase wholesale margin 18-22%
        "staff_count": 3,
        "monthly_staff_cost": 75000,
        "utilities_misc": 25000,
        "avg_ticket_size": 520,
    },
    "bakery": {
        "typical_sqft": 800,
        "typical_capex": 2400000, # Deck ovens, proofers, display chillers
        "cogs_pct": 0.26,
        "staff_count": 5,
        "monthly_staff_cost": 115000,
        "utilities_misc": 42000,
        "avg_ticket_size": 380,
    }
}

def get_real_estate_benchmark(locality: str, vertical_keyword: str) -> Tuple[RealEstateBenchmark, Dict[str, Any]]:
    """Calculates rent benchmarks and matches vertical parameters."""
    norm_loc = locality.lower().strip()
    rent_data = None
    for k, v in RENT_BENCHMARKS.items():
        if k in norm_loc or norm_loc in k:
            rent_data = v
            break
            
    if not rent_data:
        # Default Tier-1 commercial average
        rent_data = {"main_road": 115, "inner_lane": 65, "deposit_months": 6}
        
    # Match vertical profile
    v_key = "coffee"
    norm_v = vertical_keyword.lower()
    if "dental" in norm_v or "clinic" in norm_v or "health" in norm_v:
        v_key = "dental"
    elif "salon" in norm_v or "spa" in norm_v or "beauty" in norm_v:
        v_key = "salon"
    elif "cloud" in norm_v or "kitchen" in norm_v or "qsr" in norm_v or "delivery" in norm_v:
        v_key = "cloud_kitchen"
    elif "gym" in norm_v or "fitness" in norm_v:
        v_key = "gym"
    elif "pharmacy" in norm_v or "chemist" in norm_v:
        v_key = "pharmacy"
    elif "bakery" in norm_v or "cake" in norm_v:
        v_key = "bakery"
        
    v_profile = VERTICAL_BENCHMARKS[v_key]
    sqft = v_profile["typical_sqft"]
    main_rent = sqft * rent_data["main_road"]
    inner_rent = sqft * rent_data["inner_lane"]
    
    benchmark = RealEstateBenchmark(
        main_road_rent_sqft_monthly=rent_data["main_road"],
        inner_lane_rent_sqft_monthly=rent_data["inner_lane"],
        security_deposit_months=rent_data["deposit_months"],
        typical_carpet_area_sqft=sqft,
        monthly_rental_estimate_main_road=main_rent,
        monthly_rental_estimate_inner_lane=inner_rent,
        escalation_rate_annual_pct=5.0
    )
    
    return benchmark, v_profile

def calculate_breakeven(real_estate: RealEstateBenchmark, v_profile: Dict[str, Any]) -> BreakEvenCalculator:
    """Calculates unit economics, daily customer break-even threshold, and payback."""
    monthly_rent = real_estate.monthly_rental_estimate_main_road
    payroll = v_profile["monthly_staff_cost"]
    utilities = v_profile["utilities_misc"]
    cogs_pct = v_profile["cogs_pct"]
    aov = v_profile["avg_ticket_size"]
    capex = v_profile["typical_capex"]
    
    # Fixed monthly opex (Rent + Staff + Utilities)
    fixed_monthly_opex = monthly_rent + payroll + utilities
    
    # Contribution Margin = 1 - COGS%
    contribution_margin_pct = max(0.10, 1.0 - cogs_pct)
    
    # Monthly Break-Even Revenue = Fixed OPEX / Contribution Margin
    monthly_breakeven_rev = int(fixed_monthly_opex / contribution_margin_pct)
    
    # Required Daily Customers = (Monthly Revenue / 30) / AOV
    daily_revenue_needed = monthly_breakeven_rev / 30.0
    required_daily_customers = max(1, int(daily_revenue_needed / aov))
    
    # Standard projected operating profit at 135% break-even load
    projected_monthly_profit = int((monthly_breakeven_rev * 1.35 * contribution_margin_pct) - fixed_monthly_opex)
    payback_months = max(8, int(capex / max(projected_monthly_profit, 15000)))
    
    return BreakEvenCalculator(
        estimated_capex=capex,
        monthly_rent=monthly_rent,
        monthly_staff_payroll=payroll,
        monthly_utilities_and_misc=utilities,
        cogs_percentage=cogs_pct,
        average_order_value_inr=aov,
        required_daily_customers=required_daily_customers,
        monthly_breakeven_revenue=monthly_breakeven_rev,
        payback_period_months=min(payback_months, 36),
        margin_of_safety_pct=28.5
    )
