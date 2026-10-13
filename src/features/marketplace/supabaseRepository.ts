import { createClient } from "@/lib/supabase/server";
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
import { MarketplaceRepository } from "./repository";

class SupabaseMarketplaceRepositoryImpl implements MarketplaceRepository {
  async getListings(options: GetListingsOptions): Promise<{ listings: ProductListing[]; total: number }> {
    const supabase = createClient();

    let query = (supabase.from("product_listings") as any)
      .select("*, profiles!product_listings_seller_id_fkey(*)", { count: "exact" });

    if (options.status && options.status !== "all") {
      query = query.eq("status", options.status);
    } else if (!options.sellerId) {
      query = query.eq("status", "active");
    }

    if (options.sellerId) {
      query = query.eq("seller_id", options.sellerId).neq("status", "removed");
    }

    if (options.category && options.category !== "all") {
      query = query.eq("category", options.category);
    }

    if (options.district && options.district !== "all") {
      query = query.ilike("location_district", `%${options.district}%`);
    }

    if (options.taluka && options.taluka !== "all") {
      query = query.ilike("location_taluka", `%${options.taluka}%`);
    }

    if (options.minPrice !== undefined) {
      query = query.gte("price_per_unit", options.minPrice);
    }

    if (options.maxPrice !== undefined) {
      query = query.lte("price_per_unit", options.maxPrice);
    }

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      query = query.or(`commodity_name.ilike.%${q}%,variety.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (options.sortBy === "price_asc") {
      query = query.order("price_per_unit", { ascending: true });
    } else if (options.sortBy === "price_desc") {
      query = query.order("price_per_unit", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, count, error } = await query;
    if (error || !data) {
      return { listings: [], total: 0 };
    }

    const listings: ProductListing[] = data.map((row: any) => ({
      id: row.id,
      seller_id: row.seller_id,
      commodity_name: row.commodity_name,
      variety: row.variety,
      category: row.category,
      description: row.description,
      quantity_available: Number(row.quantity_available),
      quantity_unit: row.quantity_unit,
      price_per_unit: Number(row.price_per_unit),
      price_unit: row.price_unit,
      minimum_order_qty: Number(row.minimum_order_qty),
      location_district: row.location_district,
      location_taluka: row.location_taluka,
      harvest_date: row.harvest_date,
      image_urls: row.image_urls || [],
      is_organic: row.is_organic,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      seller: row.profiles
        ? {
            id: row.profiles.id,
            full_name: row.profiles.full_name,
            district: row.profiles.district,
            taluka: row.profiles.taluka,
            phone_number: row.profiles.phone_number,
            role: "farmer",
            avatar_url: row.profiles.avatar_url,
            is_verified: true,
          }
        : undefined,
    }));

    return { listings, total: count || listings.length };
  }

  async getListingById(id: string): Promise<ProductListing | null> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("product_listings") as any)
      .select("*, profiles!product_listings_seller_id_fkey(*)")
      .eq("id", id)
      .neq("status", "removed")
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      seller_id: data.seller_id,
      commodity_name: data.commodity_name,
      variety: data.variety,
      category: data.category,
      description: data.description,
      quantity_available: Number(data.quantity_available),
      quantity_unit: data.quantity_unit,
      price_per_unit: Number(data.price_per_unit),
      price_unit: data.price_unit,
      minimum_order_qty: Number(data.minimum_order_qty),
      location_district: data.location_district,
      location_taluka: data.location_taluka,
      harvest_date: data.harvest_date,
      image_urls: data.image_urls || [],
      is_organic: data.is_organic,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      seller: data.profiles
        ? {
            id: data.profiles.id,
            full_name: data.profiles.full_name,
            district: data.profiles.district,
            taluka: data.profiles.taluka,
            phone_number: data.profiles.phone_number,
            role: "farmer",
            avatar_url: data.profiles.avatar_url,
            is_verified: true,
          }
        : undefined,
    };
  }

  async createListing(input: CreateListingInput, seller: SellerInfo): Promise<ProductListing> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("product_listings") as any)
      .insert({
        seller_id: seller.id,
        commodity_name: input.commodityName,
        variety: input.variety || null,
        category: input.category,
        description: input.description || null,
        quantity_available: input.quantity,
        quantity_unit: input.quantityUnit,
        price_per_unit: input.pricePerUnit,
        price_unit: input.priceUnit,
        minimum_order_qty: input.minimumOrderQty || 1,
        location_district: input.locationDistrict,
        location_taluka: input.locationTaluka || null,
        harvest_date: input.harvestDate || null,
        image_urls: input.imageUrls || [],
        is_organic: input.isOrganic ?? false,
        status: "active",
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "यादी तयार करण्यात त्रुटी आली (Failed to create listing)");
    }

    return {
      ...data,
      seller,
    };
  }

  async updateListing(
    id: string,
    input: UpdateListingInput,
    sellerId: string,
    isAdmin = false
  ): Promise<ProductListing> {
    const supabase = createClient();

    const payload: any = {};
    if (input.commodityName) payload.commodity_name = input.commodityName;
    if (input.variety !== undefined) payload.variety = input.variety;
    if (input.category) payload.category = input.category;
    if (input.description !== undefined) payload.description = input.description;
    if (input.quantity) payload.quantity_available = input.quantity;
    if (input.quantityUnit) payload.quantity_unit = input.quantityUnit;
    if (input.pricePerUnit) payload.price_per_unit = input.pricePerUnit;
    if (input.priceUnit) payload.price_unit = input.priceUnit;
    if (input.minimumOrderQty) payload.minimum_order_qty = input.minimumOrderQty;
    if (input.locationDistrict) payload.location_district = input.locationDistrict;
    if (input.locationTaluka !== undefined) payload.location_taluka = input.locationTaluka;
    if (input.harvestDate !== undefined) payload.harvest_date = input.harvestDate;
    if (input.imageUrls) payload.image_urls = input.imageUrls;
    if (input.isOrganic !== undefined) payload.is_organic = input.isOrganic;
    if (input.status) payload.status = input.status;

    let query = (supabase.from("product_listings") as any)
      .update(payload)
      .eq("id", id);

    if (!isAdmin) {
      query = query.eq("seller_id", sellerId);
    }

    const { data, error } = await query.select().single();
    if (error || !data) {
      throw new Error(error?.message || "यादी अद्ययावत करण्यात त्रुटी आली (Failed to update listing)");
    }

    return data;
  }

  async updateListingStatus(
    id: string,
    status: ListingStatus,
    sellerId: string,
    isAdmin = false
  ): Promise<ProductListing> {
    return this.updateListing(id, { status }, sellerId, isAdmin);
  }

  async deleteListing(id: string, sellerId: string, isAdmin = false): Promise<boolean> {
    const supabase = createClient();

    let query = (supabase.from("product_listings") as any)
      .update({ status: "removed" })
      .eq("id", id);

    if (!isAdmin) {
      query = query.eq("seller_id", sellerId);
    }

    const { error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  async getEnquiries(params: {
    listingId?: string;
    buyerId?: string;
    sellerId?: string;
  }): Promise<MarketplaceEnquiry[]> {
    const supabase = createClient();

    let query = (supabase.from("marketplace_enquiries") as any)
      .select("*, profiles!marketplace_enquiries_buyer_id_fkey(*), product_listings(*)")
      .order("created_at", { ascending: false });

    if (params.listingId) {
      query = query.eq("listing_id", params.listingId);
    }
    if (params.buyerId) {
      query = query.eq("buyer_id", params.buyerId);
    }
    if (params.sellerId) {
      query = query.eq("seller_id", params.sellerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      listing_id: row.listing_id,
      buyer_id: row.buyer_id,
      seller_id: row.seller_id,
      proposed_quantity: Number(row.proposed_quantity),
      proposed_price_per_unit: row.proposed_price_per_unit ? Number(row.proposed_price_per_unit) : null,
      buyer_message: row.buyer_message,
      buyer_phone: row.buyer_phone,
      contact_preference: row.contact_preference,
      status: row.status,
      status_notes: row.status_notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      buyer: row.profiles
        ? {
            id: row.profiles.id,
            full_name: row.profiles.full_name,
            district: row.profiles.district,
            phone_number: row.profiles.phone_number,
            role: "buyer",
          }
        : undefined,
      listing: row.product_listings,
    }));
  }

  async getEnquiryById(id: string, userId: string, isAdmin = false): Promise<MarketplaceEnquiry | null> {
    const supabase = createClient();

    const { data, error } = await (supabase.from("marketplace_enquiries") as any)
      .select("*, profiles!marketplace_enquiries_buyer_id_fkey(*), product_listings(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    if (data.buyer_id !== userId && data.seller_id !== userId && !isAdmin) {
      throw new Error("आपल्याला ही चौकशी पाहण्याची परवानगी नाही (Unauthorized)");
    }

    return {
      id: data.id,
      listing_id: data.listing_id,
      buyer_id: data.buyer_id,
      seller_id: data.seller_id,
      proposed_quantity: Number(data.proposed_quantity),
      proposed_price_per_unit: data.proposed_price_per_unit ? Number(data.proposed_price_per_unit) : null,
      buyer_message: data.buyer_message,
      buyer_phone: data.buyer_phone,
      contact_preference: data.contact_preference,
      status: data.status,
      status_notes: data.status_notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      buyer: data.profiles,
      listing: data.product_listings,
    };
  }

  async createEnquiry(input: CreateEnquiryInput, buyer: BuyerInfo): Promise<MarketplaceEnquiry> {
    const supabase = createClient();

    // Verify listing first
    const { data: listing, error: listingError } = await (supabase.from("product_listings") as any)
      .select("id, seller_id, status")
      .eq("id", input.listingId)
      .single();

    if (listingError || !listing || listing.status === "removed") {
      throw new Error("यादी सापडली नाही (Listing not found)");
    }

    if (listing.seller_id === buyer.id) {
      throw new Error("स्वतःच्या यादीवर चौकशी करता येत नाही (Cannot enquire on your own listing)");
    }

    const { data, error } = await (supabase.from("marketplace_enquiries") as any)
      .insert({
        listing_id: input.listingId,
        buyer_id: buyer.id,
        seller_id: listing.seller_id,
        proposed_quantity: input.proposedQuantity,
        proposed_price_per_unit: input.proposedPricePerUnit || null,
        buyer_message: input.buyerMessage,
        buyer_phone: input.buyerPhone || buyer.phone_number || null,
        contact_preference: input.contactPreference || "phone",
        status: "new",
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "चौकशी पाठवण्यात त्रुटी आली (Failed to send enquiry)");
    }

    return {
      ...data,
      buyer,
    };
  }

  async updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus,
    notes: string | undefined,
    userId: string,
    isAdmin = false
  ): Promise<MarketplaceEnquiry> {
    const supabase = createClient();

    const { data: existing, error: fetchError } = await (supabase.from("marketplace_enquiries") as any)
      .select("*")
      .eq("id", enquiryId)
      .single();

    if (fetchError || !existing) {
      throw new Error("चौकशी सापडली नाही (Enquiry not found)");
    }

    const isSeller = existing.seller_id === userId;
    const isBuyer = existing.buyer_id === userId;

    if (!isSeller && !isBuyer && !isAdmin) {
      throw new Error("आपल्याला ही चौकशी अद्ययावत करण्याची परवानगी नाही (Unauthorized)");
    }

    if (isBuyer && !isSeller && !isAdmin && status !== "closed") {
      throw new Error("खरेदीदार केवळ चौकशी बंद करू शकतात");
    }

    const { data, error } = await (supabase.from("marketplace_enquiries") as any)
      .update({
        status,
        status_notes: notes !== undefined ? notes : existing.status_notes,
      })
      .eq("id", enquiryId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "चौकशी अपडेट करण्यात त्रुटी आली");
    }

    return data;
  }
}

export const supabaseMarketplaceRepository = new SupabaseMarketplaceRepositoryImpl();
