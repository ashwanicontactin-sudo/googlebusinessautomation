/**
 * Shared TypeScript types used across frontend and shared modules.
 */

export interface BusinessListing {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  isPaid: boolean;
}

export type Tier = "free" | "premium" | "enterprise";

export type Platform = "google" | "bing" | "justdial" | "indiamart" | "yelp";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
