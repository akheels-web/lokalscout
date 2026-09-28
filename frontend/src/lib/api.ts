import {
  FeasibilityReport,
  FeasibilityPreview,
  AreaComparisonReport,
  WatchdogSubscriptionRequest,
  WatchdogSubscriptionResponse,
} from "@/types/feasibility";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_ENGINE_API_URL || "http://127.0.0.1:8000/api";

export async function fetchLocations(query: string = ""): Promise<Array<{ locality: string; city: string; state: string; pincode: string; label: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/search/locations?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Using offline locations autocomplete:", err);
  }

  // Built-in client fallback locations
  const fallback = [
    { locality: "Madhapur", city: "Hyderabad", state: "Telangana", pincode: "500081", label: "Madhapur, Hyderabad" },
    { locality: "Gachibowli", city: "Hyderabad", state: "Telangana", pincode: "500032", label: "Gachibowli, Hyderabad" },
    { locality: "Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033", label: "Jubilee Hills, Hyderabad" },
    { locality: "Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", label: "Indiranagar, Bengaluru" },
    { locality: "Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034", label: "Koramangala, Bengaluru" },
    { locality: "HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102", label: "HSR Layout, Bengaluru" },
    { locality: "Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050", label: "Bandra West, Mumbai" },
    { locality: "Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400053", label: "Andheri West, Mumbai" },
    { locality: "DLF Cyber City", city: "Gurugram", state: "Haryana", pincode: "122002", label: "DLF Cyber City, Gurugram" },
    { locality: "Baner", city: "Pune", state: "Maharashtra", pincode: "411045", label: "Baner, Pune" },
  ];

  return fallback.filter(
    (l) =>
      !query ||
      l.locality.toLowerCase().includes(query.toLowerCase()) ||
      l.city.toLowerCase().includes(query.toLowerCase())
  );
}

export async function generatePreview(
  category: string,
  locality: string,
  city?: string
): Promise<FeasibilityPreview> {
  try {
    const res = await fetch(`${API_BASE_URL}/feasibility/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, locality, city }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Engine offline, using high-fidelity client simulation:", err);
  }

  // Client simulated fallback
  return {
    report_id: `LS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    business_vertical: category,
    locality: locality,
    city: city || "Hyderabad",
    overall_score: 79,
    viability_status: "High Demand, High Competition (Prime Battleground)",
    risk_rating: "Moderate",
    competitor_count_2km: 24,
    top_3_anchors: [
      `${locality} Mindspace IT Park & Cyber Hubs`,
      `${locality} Metro Station (Transit Interchange)`,
      "Inorbit Galleria Commercial High Street",
    ],
    executive_teaser_snippet: `${locality} presents strong corporate disposable income with high footfall density. Success hinges on solving parking and offering high-speed grab-and-go ordering...`,
    unlock_price_inr: 799,
  };
}

export async function generateFullReport(
  category: string,
  locality: string,
  city?: string
): Promise<FeasibilityReport> {
  try {
    const res = await fetch(`${API_BASE_URL}/feasibility/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, locality, city }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend not reached, generating sample dossier:", err);
  }

  return getSampleReport();
}

export async function fetchReportById(reportId: string): Promise<FeasibilityReport> {
  try {
    const res = await fetch(`${API_BASE_URL}/feasibility/report/${reportId}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Could not fetch report from engine, falling back:", err);
  }

  return getSampleReport();
}

export async function getSampleReport(): Promise<FeasibilityReport> {
  try {
    const res = await fetch(`${API_BASE_URL}/feasibility/sample`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Return pristine mock sample
  }

  return {
    report_id: "SAMPLE-MADHAPUR-COFFEE",
    business_vertical: "Specialty Coffee Shop & Cafe",
    location: {
      locality: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
      formatted_address: "Plot 42, Hitec City Road, Madhapur, Hyderabad 500081",
      coordinates: { lat: 17.4483, lng: 78.3915 },
    },
    generated_at: "Today, Instant Live Intelligence",
    overall_score: 82,
    viability_status: "High Demand, High Competition (Prime Battleground)",
    risk_rating: "Moderate",
    confidence_index: 94,
    executive_verdict:
      "Madhapur is Hyderabad's highest density commercial catchment for specialty coffee. Over 280,000 corporate professionals commute daily. While 24 direct competitors exist, severe parking friction and slow preparation create an immediate high-margin opening for an express workstation cafe.",
    unfair_advantages: [
      "Capitalize on Mindspace Tech Park (120,000+ engineers) with corporate batch subscriptions and app-less WhatsApp ordering.",
      "Solve the #1 customer pain point in Madhapur: offer dedicated two-wheeler drop-off and designated valet parking.",
      "Drive weekday 11 AM - 4 PM off-peak occupancy with ergonomic acoustic booths and fast Wi-Fi.",
    ],
    competitor_analysis: {
      total_competitors_2km: 24,
      total_competitors_5km: 52,
      saturation_score: 78,
      avg_rating: 4.3,
      top_competitors: [
        {
          name: "Third Wave Coffee (Madhapur)",
          rating: 4.4,
          reviews_count: 1420,
          address: "Hitec City Main Rd, Madhapur",
          distance_km: 0.35,
          price_tier: "Premium",
          primary_strengths: ["Signature cold brew & bagels", "High brand recall"],
          common_complaints: ["No car parking", "Cramped tables on weekends", "Billing line delay"],
        },
        {
          name: "Blue Tokai Coffee Roasters",
          rating: 4.5,
          reviews_count: 980,
          address: "Near Durgam Cheruvu Metro, Madhapur",
          distance_km: 0.8,
          price_tier: "Premium",
          primary_strengths: ["Specialty single origin pour-overs", "Quiet aesthetic"],
          common_complaints: ["Slow 20-minute order turnaround", "High price for snacks"],
        },
        {
          name: "Roastery Coffee House",
          rating: 4.6,
          reviews_count: 2150,
          address: "Near Image Hospitals, Madhapur",
          distance_km: 1.2,
          price_tier: "Premium",
          primary_strengths: ["Outdoor lush garden seating", "Comprehensive food menu"],
          common_complaints: ["45-minute wait time on weekends", "Difficult valet retrieval"],
        },
        {
          name: "True Black Specialty Coffee",
          rating: 4.3,
          reviews_count: 640,
          address: "100ft Road, Madhapur",
          distance_km: 0.65,
          price_tier: "Mid-Range",
          primary_strengths: ["Minimalist aesthetic", "Specialty manual brews"],
          common_complaints: ["Limited seating capacity (18 seats)", "No gluten-free food"],
        },
      ],
      price_distribution: { Budget: 15, "Mid-Range": 55, Premium: 30 },
      top_customer_complaints: [
        "Severe parking congestion on main Hitec road",
        "Over-extracted espresso during weekend evening rush",
        "High table wait time (>25 mins on Saturdays)",
        "Lack of power sockets for remote working professionals",
      ],
    },
    price_tier_analysis: {
      distribution: { Budget: 15, "Mid-Range": 55, Premium: 30 },
      sweet_spot_tier: "Mid-Range to Upper Mid-Range (₹280 – ₹450 AOV)",
      opportunity_rationale:
        "High concentration of corporate tech employees willing to spend ₹350+ per visit if ambience & parking friction are addressed.",
    },
    demand_anchors: {
      anchors: [
        {
          category: "Tech & Corporate Parks",
          name: "Raheja Mindspace IT Park (120,000+ workforce)",
          distance_km: 0.5,
          impact_level: "High",
        },
        {
          category: "Transit & Metro Hubs",
          name: "Madhapur Metro Station (Blue Line)",
          distance_km: 0.35,
          impact_level: "High",
        },
        {
          category: "Shopping Malls & Retail",
          name: "Inorbit Mall Cyberabad",
          distance_km: 1.1,
          impact_level: "High",
        },
        {
          category: "Colleges & Youth",
          name: "NIFT Hyderabad Campus & Design Hostels",
          distance_km: 1.4,
          impact_level: "Medium",
        },
        {
          category: "Residential Clusters",
          name: "My Home Bhooja & Aparna Luxury Towers",
          distance_km: 0.9,
          impact_level: "High",
        },
      ],
      summary:
        "High-density commercial precinct with 5 primary anchors generating constant daytime office footfall and heavy weekend retail transit.",
      footfall_density_rating: "Very High",
    },
    peak_windows: [
      {
        time_window: "08:30 AM - 11:00 AM",
        label: "Morning Tech Inflow & Executive Transit",
        intensity_score: 88,
        dominant_demographic: "Corporate Employees, Consultants & Founders",
      },
      {
        time_window: "12:30 PM - 02:30 PM",
        label: "Mid-Day Lunch & Fast Meeting Rush",
        intensity_score: 82,
        dominant_demographic: "Tech Teams & Business Diners",
      },
      {
        time_window: "05:30 PM - 08:30 PM",
        label: "Evening Social & Leisure Peak",
        intensity_score: 96,
        dominant_demographic: "Young Professionals, Couples & Groups",
      },
      {
        time_window: "08:30 PM - 11:00 PM",
        label: "Dinner & Post-Dinner Walk-In",
        intensity_score: 75,
        dominant_demographic: "Local Residents & Late Working Cohorts",
      },
    ],
    search_intent: [
      {
        keyword: "best coffee shop near me in madhapur",
        monthly_searches: 6200,
        growth_yoy: "+38%",
        commercial_intent: "Very High",
      },
      {
        keyword: "specialty coffee madhapur hyderabad",
        monthly_searches: 3400,
        growth_yoy: "+44%",
        commercial_intent: "High",
      },
      {
        keyword: "cafe with wifi for work madhapur",
        monthly_searches: 2800,
        growth_yoy: "+65%",
        commercial_intent: "Very High",
      },
      {
        keyword: "roastery cafe madhapur menu prices",
        monthly_searches: 4100,
        growth_yoy: "+22%",
        commercial_intent: "High",
      },
    ],
    real_estate: {
      main_road_rent_sqft_monthly: 125,
      inner_lane_rent_sqft_monthly: 70,
      security_deposit_months: 6,
      typical_carpet_area_sqft: 1000,
      monthly_rental_estimate_main_road: 125000,
      monthly_rental_estimate_inner_lane: 70000,
      escalation_rate_annual_pct: 5.0,
    },
    break_even: {
      estimated_capex: 2800000,
      monthly_rent: 125000,
      monthly_staff_payroll: 125000,
      monthly_utilities_and_misc: 45000,
      cogs_percentage: 0.28,
      average_order_value_inr: 340,
      required_daily_customers: 41,
      monthly_breakeven_revenue: 410000,
      payback_period_months: 18,
      margin_of_safety_pct: 28.5,
    },
    strategic_gaps: [
      {
        opportunity_title: "Acoustic Workstation Cafe with High-Speed Mesh Wi-Fi",
        description:
          "Over 75% of existing cafes in Madhapur play loud lounge music and lack ergonomic seating. Creating quiet productivity pods captures remote tech leads and corporate 1-on-1s between 11 AM and 5 PM.",
        why_it_works:
          "Fills otherwise dead afternoon capacity, generating ₹65,000+ extra monthly beverage revenue with zero food waste.",
      },
      {
        opportunity_title: "Express 90-Second Grab-and-Go Morning Window",
        description:
          "Thousands of corporate staff exit Madhapur Metro Station between 8:30 AM and 10:00 AM. Existing venues take 12-18 minutes per order. An outdoor express hatch serving quick cold brews, cappuccinos, and croissants captures this high-velocity traffic.",
        why_it_works:
          "Adds 60-80 high-margin transactions per day before prime sit-down operational hours even commence.",
      },
      {
        opportunity_title: "WhatsApp VIP Loyalty Club (No App Download Required)",
        description:
          "National chains force clunky mobile apps with 5-minute signups. A frictionless WhatsApp QR loyalty system offering 10% instant cashback on the 4th coffee drives aggressive neighbourhood retention.",
        why_it_works:
          "Creates a direct direct-to-consumer communication channel to announce fresh bean drops and weekend tasting events.",
      },
    ],
    launch_action_plan: {
      week_1_to_2:
        "Finalize commercial lease on Madhapur 100ft road or Mindspace lane with 45-day rent-free fitout grace period. Lock interior plan maximizing counter visibility.",
      week_3_to_4:
        "File FSSAI, Fire NOC & Trade License. Finalize direct coffee bean procurement agreements with Chikmagalur & Araku estates.",
      week_5_to_8:
        "Activate GrowLokal Autopilot: Claim Google Maps 3-Pack, launch 'Coming Soon' VIP waitlist, and distribute WhatsApp VIP passes to Mindspace corporate towers.",
      growlokal_offer_code: "LOKALSCOUT1000",
      growlokal_offer_details:
        "Claim ₹1,000 credit towards GrowLokal Autopilot. Includes Google Maps 3-Pack setup, launch microsite, and automated WhatsApp review magnet.",
    },
    is_unlocked: true,
  };
}

export async function compareAreas(
  category: string,
  localities: string[]
): Promise<AreaComparisonReport> {
  try {
    const res = await fetch(`${API_BASE_URL}/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, localities }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Comparison engine offline, using simulated fallback:", err);
  }

  return {
    category,
    items: [
      {
        locality: localities[0] || "Madhapur",
        overall_score: 82,
        viability_status: "High Demand, Prime Battleground",
        competitor_count: 24,
        avg_rent_sqft: 125,
        daily_footfall_score: 92,
        recommended_positioning: "Express Workstation Specialty Bar",
        verdict: "Vast daily tech footfall, high AOV tolerance, intense competition.",
      },
      {
        locality: localities[1] || "Gachibowli",
        overall_score: 86,
        viability_status: "Prime Sweet Spot",
        competitor_count: 14,
        avg_rent_sqft: 110,
        daily_footfall_score: 88,
        recommended_positioning: "Drive-thru / Large Format Garden Cafe",
        verdict: "Optimal balance of corporate clusters and 15% lower commercial rent.",
      },
      {
        locality: localities[2] || "Jubilee Hills",
        overall_score: 74,
        viability_status: "Luxury Prestige / High Rent",
        competitor_count: 32,
        avg_rent_sqft: 190,
        daily_footfall_score: 84,
        recommended_positioning: "Ultra-Premium Experimental Roastery",
        verdict: "Highest prestige and ticket size, but high rent requires ₹18L+ monthly turnover.",
      },
    ],
    winner_locality: localities[1] || "Gachibowli",
    winner_rationale:
      "Gachibowli offers the highest risk-adjusted commercial ROI, combining massive Financial District footfall with 15% lower rent per sq.ft than Madhapur.",
    summary_matrix: {
      winner: localities[1] || "Gachibowli",
      best_for_budget: localities[1] || "Gachibowli",
      highest_demand: localities[0] || "Madhapur",
    },
  };
}

export async function subscribeWatchdog(req: WatchdogSubscriptionRequest): Promise<WatchdogSubscriptionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/watchdog/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Using offline Watchdog simulator:", err);
  }

  return {
    subscription_id: `WD-${req.pincode}-OFFLINE`,
    status: "active",
    pincode: req.pincode,
    locality: req.locality,
    category: req.category,
    monitored_radius_km: 2.0,
    active_alerts_count: 3,
    latest_alerts: [
      {
        alert_id: "ALT-WD-01",
        timestamp: "Yesterday, 04:15 PM",
        competitor_name: "Third Wave Coffee (New Extension)",
        distance_m: 380,
        event_type: "New Competitor Opening",
        severity: "High Attention",
        summary: "New 1,400 sq.ft. specialty cafe commenced commercial interior fit-outs near high-street junction.",
        recommended_counter_move: "Lock in nearby tech park corporate coffee subscriptions and launch an early-bird morning combo.",
      },
      {
        alert_id: "ALT-WD-02",
        timestamp: "3 days ago",
        competitor_name: "Blue Tokai Coffee Roasters",
        distance_m: 620,
        event_type: "Rating Drop Spike",
        severity: "Moderate Impact",
        summary: "Competitor rating dipped from 4.6 to 4.2 following recurring customer complaints about lack of car parking and seating.",
        recommended_counter_move: "Highlight your dedicated valet parking or spacious seating capacity in promotional messaging.",
      },
      {
        alert_id: "ALT-WD-03",
        timestamp: "1 week ago",
        competitor_name: "Starbucks India",
        distance_m: 950,
        event_type: "Significant Price Change",
        severity: "Informational",
        summary: "Competitor escalated beverage pricing by 8.5% across seasonal pour-overs and iced beverages.",
        recommended_counter_move: "Emphasize artisanal quality beans at a 20% friendlier price point to capture value-conscious regulars.",
      },
    ],
    next_audit_date: "Next Monday, 09:00 AM",
  };
}

export async function fetchWatchdogAlerts(pincode: string): Promise<WatchdogSubscriptionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/watchdog/alerts/${encodeURIComponent(pincode)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Using offline Watchdog alerts:", err);
  }

  return await subscribeWatchdog({
    email: "operator@lokalscout.in",
    locality: "Target Territory",
    pincode: pincode,
    category: "Specialty Coffee Shop & Cafe",
  });
}
