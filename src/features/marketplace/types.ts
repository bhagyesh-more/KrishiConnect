import {
  CommodityCategory,
  PriceUnit,
  ListingStatus,
  EnquiryStatus,
} from "@/types/database.types";

export type { CommodityCategory, PriceUnit, ListingStatus, EnquiryStatus };

export interface SellerInfo {
  id: string;
  full_name: string;
  district: string;
  taluka?: string | null;
  phone_number?: string | null;
  role: string;
  avatar_url?: string | null;
  is_verified?: boolean;
}

export interface BuyerInfo {
  id: string;
  full_name: string;
  district: string;
  phone_number?: string | null;
  role: string;
}

export interface ProductListing {
  id: string;
  seller_id: string;
  commodity_name: string;
  variety: string | null;
  category: CommodityCategory;
  description: string | null;
  quantity_available: number;
  quantity_unit: PriceUnit;
  price_per_unit: number;
  price_unit: PriceUnit;
  minimum_order_qty: number;
  location_district: string;
  location_taluka: string | null;
  harvest_date: string | null;
  image_urls: string[];
  is_organic: boolean;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  seller?: SellerInfo;
}

export interface MarketplaceEnquiry {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  proposed_quantity: number;
  proposed_price_per_unit: number | null;
  buyer_message: string;
  buyer_phone: string | null;
  contact_preference: "phone" | "whatsapp" | "visit";
  status: EnquiryStatus;
  status_notes: string | null;
  created_at: string;
  updated_at: string;
  listing?: ProductListing;
  buyer?: BuyerInfo;
  seller?: SellerInfo;
}

export interface GetListingsOptions {
  category?: CommodityCategory | "all";
  district?: string;
  taluka?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ListingStatus | "all";
  sortBy?: "newest" | "price_asc" | "price_desc";
  sellerId?: string;
  limit?: number;
  offset?: number;
}
