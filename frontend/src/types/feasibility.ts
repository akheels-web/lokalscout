export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  locality: string;
  city: string;
  state: string;
  pincode?: string;
  formatted_address: string;
  coordinates: Coordinates;
}

export interface CompetitorItem {
  name: string;
  rating: number;
  reviews_count: number;
  address: string;
  distance_km: number;
  price_tier: string;
  primary_strengths: string[];
  common_complaints: string[];
}

export interface CompetitorAnalysis {
  total_competitors_2km: number;
  total_competitors_5km: number;
  saturation_score: number;
  avg_rating: number;
  top_competitors: CompetitorItem[];
  price_distribution: Record<string, number>;
  top_customer_complaints: string[];
}

export interface DemandAnchor {
  category: string;
  name: string;
  distance_km: number;
  impact_level: string;
}

export interface DemandAnchorsAnalysis {
  anchors: DemandAnchor[];
  summary: string;
  footfall_density_rating: string;
}

export interface CommuteWindow {
  time_window: string;
  label: string;
  intensity_score: number;
  dominant_demographic: string;
}

export interface SearchIntentTrend {
  keyword: string;
  monthly_searches: number;
  growth_yoy: string;
  commercial_intent: string;
}

export interface RealEstateBenchmark {
  main_road_rent_sqft_monthly: number;
  inner_lane_rent_sqft_monthly: number;
  security_deposit_months: number;
  typical_carpet_area_sqft: number;
  monthly_rental_estimate_main_road: number;
  monthly_rental_estimate_inner_lane: number;
  escalation_rate_annual_pct: number;
}

export interface BreakEvenCalculator {
  estimated_capex: number;
  monthly_rent: number;
  monthly_staff_payroll: number;
  monthly_utilities_and_misc: number;
  cogs_percentage: number;
  average_order_value_inr: number;
  required_daily_customers: number;
  monthly_breakeven_revenue: number;
  payback_period_months: number;
  margin_of_safety_pct: number;
}

export interface StrategicGap {
  opportunity_title: string;
  description: string;
  why_it_works: string;
}

export interface LaunchActionPlan {
  week_1_to_2: string;
  week_3_to_4: string;
  week_5_to_8: string;
  growlokal_offer_code: string;
  growlokal_offer_details: string;
}

export interface FeasibilityReport {
  report_id: string;
  business_vertical: string;
  location: LocationInfo;
  generated_at: string;
  overall_score: number;
  viability_status: string;
  risk_rating: string;
  confidence_index: number;
  executive_verdict: string;
  unfair_advantages: string[];
  competitor_analysis: CompetitorAnalysis;
  price_tier_analysis: {
    distribution: Record<string, number>;
    sweet_spot_tier: string;
    opportunity_rationale: string;
  };
  demand_anchors: DemandAnchorsAnalysis;
  peak_windows: CommuteWindow[];
  search_intent: SearchIntentTrend[];
  real_estate: RealEstateBenchmark;
  break_even: BreakEvenCalculator;
  strategic_gaps: StrategicGap[];
  launch_action_plan: LaunchActionPlan;
  is_unlocked: boolean;
}

export interface FeasibilityPreview {
  report_id: string;
  business_vertical: string;
  locality: string;
  city: string;
  overall_score: number;
  viability_status: string;
  risk_rating: string;
  competitor_count_2km: number;
  top_3_anchors: string[];
  executive_teaser_snippet: string;
  unlock_price_inr: number;
}

export interface ComparisonItem {
  locality: string;
  overall_score: number;
  viability_status: string;
  competitor_count: number;
  avg_rent_sqft: number;
  daily_footfall_score: number;
  recommended_positioning: string;
  verdict: string;
}

export interface AreaComparisonReport {
  category: string;
  items: ComparisonItem[];
  winner_locality: string;
  winner_rationale: string;
  summary_matrix: {
    winner: string;
    best_for_budget: string;
    highest_demand: string;
  };
}
