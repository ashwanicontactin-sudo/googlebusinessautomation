export interface Business {
  id: number;
  name: string;
  description?: string;
  description_seo?: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  keywords?: string[];
  is_paid?: boolean;
  plan_tier?: string;
  logo_url?: string;
  published?: boolean;
  public_slug?: string;
}

export interface Platform {
  name: string;
  label: string;
}

export interface ListingSubmission {
  business_id: number;
  platform: string;
  credentials?: Record<string, unknown>;
}

export interface AdCampaign {
  id: number;
  business_id: number;
  title: string;
  budget: number;
  daily_budget: number;
  start_date: string;
  end_date?: string;
  status: "draft" | "active" | "paused" | "completed";
  impressions: number;
  clicks: number;
}

export interface Keyword {
  id: number;
  keyword: string;
  category: string;
  search_volume?: number;
}
