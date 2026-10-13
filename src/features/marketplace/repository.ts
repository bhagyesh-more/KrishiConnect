import {
  ProductListing,
  MarketplaceEnquiry,
  GetListingsOptions,
  SellerInfo,
  BuyerInfo,
  ListingStatus,
  EnquiryStatus,
} from "./types";
import {
  CreateListingInput,
  UpdateListingInput,
  CreateEnquiryInput,
} from "./schemas";

export interface MarketplaceRepository {
  getListings(options: GetListingsOptions): Promise<{ listings: ProductListing[]; total: number }>;
  getListingById(id: string): Promise<ProductListing | null>;
  createListing(input: CreateListingInput, seller: SellerInfo): Promise<ProductListing>;
  updateListing(id: string, input: UpdateListingInput, sellerId: string, isAdmin?: boolean): Promise<ProductListing>;
  updateListingStatus(id: string, status: ListingStatus, sellerId: string, isAdmin?: boolean): Promise<ProductListing>;
  deleteListing(id: string, sellerId: string, isAdmin?: boolean): Promise<boolean>;

  getEnquiries(params: { listingId?: string; buyerId?: string; sellerId?: string }): Promise<MarketplaceEnquiry[]>;
  getEnquiryById(id: string, userId: string, isAdmin?: boolean): Promise<MarketplaceEnquiry | null>;
  createEnquiry(input: CreateEnquiryInput, buyer: BuyerInfo): Promise<MarketplaceEnquiry>;
  updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus,
    notes: string | undefined,
    userId: string,
    isAdmin?: boolean
  ): Promise<MarketplaceEnquiry>;
}

// Factory to resolve appropriate repository (Mock vs Supabase)
import { mockMarketplaceRepository } from "./mockRepository";
import { supabaseMarketplaceRepository } from "./supabaseRepository";

export function getMarketplaceRepository(): MarketplaceRepository {
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder-anon-key");

  // In local demo or unconfigured mode, use deterministic mock repository
  if (!isSupabaseConfigured) {
    return mockMarketplaceRepository;
  }

  return supabaseMarketplaceRepository;
}
