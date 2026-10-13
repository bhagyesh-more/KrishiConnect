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

// Baseline Sellers (Matches farmers and sellers in Maharashtra)
export const MOCK_SELLERS: Record<string, SellerInfo> = {
  farmer_ramesh: {
    id: "00000000-0000-0000-0000-000000000020",
    full_name: "रमेश पाटील (Ramesh Patil)",
    district: "नाशिक (Nashik)",
    taluka: "निफाड",
    phone_number: "+91 98220 11223",
    role: "farmer",
    is_verified: true,
  },
  farmer_sopan: {
    id: "00000000-0000-0000-0000-000000000021",
    full_name: "सोपान पाटील (Sopan Patil)",
    district: "जळगाव (Jalgaon)",
    taluka: "रावेर",
    phone_number: "+91 94220 33445",
    role: "farmer",
    is_verified: true,
  },
  farmer_vitthal: {
    id: "00000000-0000-0000-0000-000000000022",
    full_name: "विठ्ठल जाधव (Vitthal Jadhav)",
    district: "कोल्हापूर (Kolhapur)",
    taluka: "करवीर",
    phone_number: "+91 98230 55667",
    role: "farmer",
    is_verified: true,
  },
  farmer_sunita: {
    id: "00000000-0000-0000-0000-000000000023",
    full_name: "सुनिता मोरे (Sunita More)",
    district: "पुणे (Pune)",
    taluka: "पुरंदर",
    phone_number: "+91 98500 77889",
    role: "farmer",
    is_verified: true,
  },
  farmer_dnyaneshwar: {
    id: "00000000-0000-0000-0000-000000000024",
    full_name: "ज्ञानेश्वर शिंदे (Dnyaneshwar Shinde)",
    district: "लातूर (Latur)",
    taluka: "औसा",
    phone_number: "+91 99210 99881",
    role: "farmer",
    is_verified: true,
  },
  seller_mahavir: {
    id: "00000000-0000-0000-0000-000000000025",
    full_name: "महावीर ॲग्रो ट्रेडर्स (Mahavir Agro Traders)",
    district: "अहमदनगर (Ahmednagar)",
    taluka: "राहुरी",
    phone_number: "+91 98225 44332",
    role: "seller",
    is_verified: true,
  },
};

// Baseline Buyers
export const MOCK_BUYERS: Record<string, BuyerInfo> = {
  buyer_rajesh: {
    id: "00000000-0000-0000-0000-000000000030",
    full_name: "राजेश ॲग्रोटेक (Rajesh Agrotech)",
    district: "पुणे (Pune)",
    phone_number: "+91 98810 12345",
    role: "buyer",
  },
  buyer_sunil: {
    id: "00000000-0000-0000-0000-000000000031",
    full_name: "सुनील व्हेजिटेबल होलसेल (Sunil Veg Wholesale)",
    district: "मुंबई उपनगर (Vashi APMC)",
    phone_number: "+91 98200 54321",
    role: "buyer",
  },
  buyer_sahyadri: {
    id: "00000000-0000-0000-0000-000000000032",
    full_name: "सह्याद्री फ्रेश रिटेल (Sahyadri Fresh Retail)",
    district: "नाशिक (Nashik)",
    phone_number: "+91 98900 67890",
    role: "buyer",
  },
  buyer_kisan: {
    id: "00000000-0000-0000-0000-000000000033",
    full_name: "किसान ॲग्रो प्रोसेसर्स (Kisan Agro Processors)",
    district: "सोलापूर (Solapur)",
    phone_number: "+91 94230 89012",
    role: "buyer",
  },
};

const INITIAL_LISTINGS: ProductListing[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    seller_id: MOCK_SELLERS.farmer_ramesh.id,
    commodity_name: "लाल कांदा (Lasalgaon Red Onion)",
    variety: "गावराण / गरवा (Garwa High Shelf-life)",
    category: "vegetables",
    description: "लासूर-निफाड पट्ट्यातील दर्जेदार सुकवलेला लाल कांदा. साठवणुकीसाठी अत्यंत उत्तम, मध्यम ते मोठा आकार (४५-५५ मिमी). थेट बांधावर पाहणी करून खरेदी करू शकता.",
    quantity_available: 80,
    quantity_unit: "per_quintal",
    price_per_unit: 2650,
    price_unit: "per_quintal",
    minimum_order_qty: 10,
    location_district: "नाशिक (Nashik)",
    location_taluka: "निफाड",
    harvest_date: "2026-04-10",
    image_urls: [],
    is_organic: false,
    status: "active",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_ramesh,
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    seller_id: MOCK_SELLERS.farmer_sopan.id,
    commodity_name: "ग्रँड नैन केळी (Grand Naine Banana)",
    variety: "G-9 Tissue Culture",
    category: "fruits",
    description: "रावेर तालुक्यातील निर्यातक्षम दर्जाची सेंद्रिय पद्धतीने पिकवलेली हिरवी केळी. घड निरोगी आणि जाड बोटांची (Grade A). किमान ५० क्रेट किंवा थेट गाडी भरून खरेदी.",
    quantity_available: 500,
    quantity_unit: "per_crate",
    price_per_unit: 380,
    price_unit: "per_crate",
    minimum_order_qty: 25,
    location_district: "जळगाव (Jalgaon)",
    location_taluka: "रावेर",
    harvest_date: "2026-05-15",
    image_urls: [],
    is_organic: true,
    status: "active",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_sopan,
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    seller_id: MOCK_SELLERS.farmer_vitthal.id,
    commodity_name: "कोल्हापुरी सेंद्रिय गूळ (Kolhapuri Jaggery)",
    variety: "सेंद्रिय ढेप गूळ (1kg Blocks)",
    category: "other",
    description: "८६०३२ उसाच्या ताज्या रसापासून बनवलेला शुद्ध कोल्हापुरी पिवळसर तांबूस गूळ. कोणत्याही रसायनांचा अथवा हायड्रो पावडरचा वापर नाही. लॅब टेस्ट प्रमाणित.",
    quantity_available: 40,
    quantity_unit: "per_quintal",
    price_per_unit: 5200,
    price_unit: "per_quintal",
    minimum_order_qty: 2,
    location_district: "कोल्हापूर (Kolhapur)",
    location_taluka: "करवीर",
    harvest_date: "2026-03-25",
    image_urls: [],
    is_organic: true,
    status: "active",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_vitthal,
  },
  {
    id: "00000000-0000-0000-0000-000000000104",
    seller_id: MOCK_SELLERS.farmer_sunita.id,
    commodity_name: "भगवा डाळिंब (Bhagwa Pomegranate)",
    variety: "भगवा सुपर (Export Quality)",
    category: "fruits",
    description: "ठिबक सिंचन व जीवामृत खतांवर घेतलेले चमकदार लाल दाण्यांचे भगवा डाळिंब. वजन २५०-३५० ग्रॅम प्रति नग. गोड आणि रसाळ फळे.",
    quantity_available: 60,
    quantity_unit: "per_quintal",
    price_per_unit: 11500,
    price_unit: "per_quintal",
    minimum_order_qty: 5,
    location_district: "पुणे (Pune)",
    location_taluka: "पुरंदर",
    harvest_date: "2026-04-02",
    image_urls: [],
    is_organic: true,
    status: "active",
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_sunita,
  },
  {
    id: "00000000-0000-0000-0000-000000000105",
    seller_id: MOCK_SELLERS.farmer_dnyaneshwar.id,
    commodity_name: "सोयाबीन (JS-335 Grade A Soybean)",
    variety: "JS-335 ग्रेड १",
    category: "grains",
    description: "चांगले वाळवलेले, ओलावा १०% पेक्षा कमी, कचरामुक्त भरडलेले सोयाबीन. तेल गिरण्या व व्यापारी बांधवांसाठी योग्य लॉट. थेट वजनकाटा व रोख/RTGS व्यवहार.",
    quantity_available: 150,
    quantity_unit: "per_quintal",
    price_per_unit: 4650,
    price_unit: "per_quintal",
    minimum_order_qty: 20,
    location_district: "लातूर (Latur)",
    location_taluka: "औसा",
    harvest_date: "2026-02-18",
    image_urls: [],
    is_organic: false,
    status: "active",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_dnyaneshwar,
  },
  {
    id: "00000000-0000-0000-0000-000000000106",
    seller_id: MOCK_SELLERS.farmer_ramesh.id,
    commodity_name: "हायब्रिड टोमॅटो (Hybrid Red Tomato)",
    variety: "अभिनव (Seminis Abhinav)",
    category: "vegetables",
    description: "टणक, गोल आणि चमकदार लाल रंगाचा टोमॅटो. लांबच्या वाहतुकीसाठी योग्य. रोज १०० क्रेट काढणी चालू आहे. थेट गाडी भरण्यासाठी संपर्क करा.",
    quantity_available: 120,
    quantity_unit: "per_crate",
    price_per_unit: 420,
    price_unit: "per_crate",
    minimum_order_qty: 15,
    location_district: "नाशिक (Nashik)",
    location_taluka: "निफाड",
    harvest_date: "2026-04-12",
    image_urls: [],
    is_organic: false,
    status: "active",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_ramesh,
  },
  {
    id: "00000000-0000-0000-0000-000000000107",
    seller_id: MOCK_SELLERS.farmer_vitthal.id,
    commodity_name: "ब्याडगी सुकी लाल मिरची (Byadgi Dried Chilli)",
    variety: "ब्याडगी काडी (High Colour)",
    category: "spices",
    description: "मसाल्यासाठी प्रसिद्ध सुरकुतलेली गडद लाल मिरची. नैसर्गिक उन्हात सुकवलेली. रंग अतिशय गडद व कमी तिखट.",
    quantity_available: 25,
    quantity_unit: "per_quintal",
    price_per_unit: 18500,
    price_unit: "per_quintal",
    minimum_order_qty: 2,
    location_district: "कोल्हापूर (Kolhapur)",
    location_taluka: "करवीर",
    harvest_date: "2026-03-10",
    image_urls: [],
    is_organic: false,
    status: "active",
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_vitthal,
  },
  {
    id: "00000000-0000-0000-0000-000000000108",
    seller_id: MOCK_SELLERS.farmer_dnyaneshwar.id,
    commodity_name: "सफेद तूर / तूर डाळ (Latur White Toor)",
    variety: "BSMR-736 (मारुती)",
    category: "pulses",
    description: "लातूर मार्केट यार्ड दर्जाची पांढरी तूर. दाणेदार आणि एकसारखा आकार. डाळ मिलसाठी अतिशय उपयुक्त.",
    quantity_available: 90,
    quantity_unit: "per_quintal",
    price_per_unit: 9400,
    price_unit: "per_quintal",
    minimum_order_qty: 10,
    location_district: "लातूर (Latur)",
    location_taluka: "औसा",
    harvest_date: "2026-01-20",
    image_urls: [],
    is_organic: false,
    status: "active",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    seller: MOCK_SELLERS.farmer_dnyaneshwar,
  },
];

const INITIAL_ENQUIRIES: MarketplaceEnquiry[] = [
  {
    id: "00000000-0000-0000-0000-000000000201",
    listing_id: "00000000-0000-0000-0000-000000000101",
    buyer_id: MOCK_BUYERS.buyer_sunil.id,
    seller_id: MOCK_SELLERS.farmer_ramesh.id,
    proposed_quantity: 40,
    proposed_price_per_unit: 2600,
    buyer_message: "आम्हाला वाशी मार्केटसाठी ३५ ते ४० क्विंटल चांगल्या दर्जाचा कांदा हवा आहे. माल कधी प्रत्यक्ष पाहता येईल?",
    buyer_phone: "+91 98200 54321",
    contact_preference: "phone",
    status: "new",
    status_notes: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    buyer: MOCK_BUYERS.buyer_sunil,
    seller: MOCK_SELLERS.farmer_ramesh,
    listing: INITIAL_LISTINGS[0],
  },
  {
    id: "00000000-0000-0000-0000-000000000202",
    listing_id: "00000000-0000-0000-0000-000000000105",
    buyer_id: MOCK_BUYERS.buyer_rajesh.id,
    seller_id: MOCK_SELLERS.farmer_dnyaneshwar.id,
    proposed_quantity: 100,
    proposed_price_per_unit: 4600,
    buyer_message: "आमची ऑइल मिल पुणे परिसरात आहे. १०० क्विंटल थेट गाडी उचलण्याची तयारी आहे. ओलावा चाचणी नंतर अंतिम व्यवहार करू.",
    buyer_phone: "+91 98810 12345",
    contact_preference: "whatsapp",
    status: "contacted",
    status_notes: "फोनवर प्राथमिक चर्चा झाली, नमुना पाठवला आहे.",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    buyer: MOCK_BUYERS.buyer_rajesh,
    seller: MOCK_SELLERS.farmer_dnyaneshwar,
    listing: INITIAL_LISTINGS[4],
  },
];

class MockMarketplaceRepositoryImpl implements MarketplaceRepository {
  private listings: ProductListing[] = [...INITIAL_LISTINGS];
  private enquiries: MarketplaceEnquiry[] = [...INITIAL_ENQUIRIES];

  async getListings(options: GetListingsOptions = {}): Promise<{ listings: ProductListing[]; total: number }> {
    let result = [...this.listings];

    // Filter by category
    if (options.category && options.category !== "all") {
      result = result.filter((l) => l.category === options.category);
    }

    // Filter by status
    if (options.status && options.status !== "all") {
      result = result.filter((l) => l.status === options.status);
    } else if (!options.status) {
      // Default to active listings if not filtering by seller
      if (!options.sellerId) {
        result = result.filter((l) => l.status === "active");
      }
    }

    // Filter by sellerId (e.g., My Listings)
    if (options.sellerId) {
      result = result.filter((l) => l.seller_id === options.sellerId && l.status !== "removed");
    }

    // Filter by district
    if (options.district && options.district !== "all") {
      result = result.filter((l) =>
        l.location_district.toLowerCase().includes(options.district!.toLowerCase())
      );
    }

    // Filter by taluka
    if (options.taluka && options.taluka !== "all") {
      result = result.filter(
        (l) => l.location_taluka && l.location_taluka.toLowerCase().includes(options.taluka!.toLowerCase())
      );
    }

    // Price range
    if (options.minPrice !== undefined) {
      result = result.filter((l) => l.price_per_unit >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      result = result.filter((l) => l.price_per_unit <= options.maxPrice!);
    }

    // Search query (matches commodity name, variety, description)
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.commodity_name.toLowerCase().includes(q) ||
          (l.variety && l.variety.toLowerCase().includes(q)) ||
          (l.description && l.description.toLowerCase().includes(q)) ||
          l.location_district.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (options.sortBy === "price_asc") {
      result.sort((a, b) => a.price_per_unit - b.price_per_unit);
    } else if (options.sortBy === "price_desc") {
      result.sort((a, b) => b.price_per_unit - a.price_per_unit);
    } else {
      // newest first
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const total = result.length;
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const paginated = result.slice(offset, offset + limit);

    return { listings: paginated, total };
  }

  async getListingById(id: string): Promise<ProductListing | null> {
    const listing = this.listings.find((l) => l.id === id);
    if (!listing || listing.status === "removed") return null;
    return listing;
  }

  async createListing(input: CreateListingInput, seller: SellerInfo): Promise<ProductListing> {
    if (input.quantity <= 0) {
      throw new Error("प्रमाण शून्य किंवा ऋण असू शकत नाही (Quantity must be greater than 0)");
    }
    if (input.pricePerUnit <= 0) {
      throw new Error("दर शून्य किंवा ऋण असू शकत नाही (Price must be greater than 0)");
    }

    const newListing: ProductListing = {
      id: crypto.randomUUID(),
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller,
    };

    this.listings.unshift(newListing);
    return newListing;
  }

  async updateListing(
    id: string,
    input: UpdateListingInput,
    sellerId: string,
    isAdmin = false
  ): Promise<ProductListing> {
    const idx = this.listings.findIndex((l) => l.id === id);
    if (idx === -1) {
      throw new Error("यादी सापडली नाही (Listing not found)");
    }

    const existing = this.listings[idx];
    if (existing.seller_id !== sellerId && !isAdmin) {
      throw new Error("आपल्याला ही यादी सुधारण्याची परवानगी नाही (Unauthorized: Not the listing owner)");
    }

    if (input.quantity !== undefined && input.quantity <= 0) {
      throw new Error("प्रमाण शून्य किंवा ऋण असू शकत नाही (Quantity must be positive)");
    }
    if (input.pricePerUnit !== undefined && input.pricePerUnit <= 0) {
      throw new Error("दर शून्य किंवा ऋण असू शकत नाही (Price must be positive)");
    }

    const updated: ProductListing = {
      ...existing,
      commodity_name: input.commodityName ?? existing.commodity_name,
      variety: input.variety !== undefined ? input.variety : existing.variety,
      category: input.category ?? existing.category,
      description: input.description !== undefined ? input.description : existing.description,
      quantity_available: input.quantity ?? existing.quantity_available,
      quantity_unit: input.quantityUnit ?? existing.quantity_unit,
      price_per_unit: input.pricePerUnit ?? existing.price_per_unit,
      price_unit: input.priceUnit ?? existing.price_unit,
      minimum_order_qty: input.minimumOrderQty ?? existing.minimum_order_qty,
      location_district: input.locationDistrict ?? existing.location_district,
      location_taluka: input.locationTaluka !== undefined ? input.locationTaluka : existing.location_taluka,
      harvest_date: input.harvestDate !== undefined ? input.harvestDate : existing.harvest_date,
      image_urls: input.imageUrls ?? existing.image_urls,
      is_organic: input.isOrganic !== undefined ? input.isOrganic : existing.is_organic,
      status: input.status ?? existing.status,
      updated_at: new Date().toISOString(),
    };

    this.listings[idx] = updated;
    return updated;
  }

  async updateListingStatus(
    id: string,
    status: ListingStatus,
    sellerId: string,
    isAdmin = false
  ): Promise<ProductListing> {
    const idx = this.listings.findIndex((l) => l.id === id);
    if (idx === -1) {
      throw new Error("यादी सापडली नाही (Listing not found)");
    }

    const existing = this.listings[idx];
    if (existing.seller_id !== sellerId && !isAdmin) {
      throw new Error("आपल्याला यादीची स्थिती बदलण्याची परवानगी नाही (Unauthorized)");
    }

    const updated: ProductListing = {
      ...existing,
      status,
      updated_at: new Date().toISOString(),
    };

    this.listings[idx] = updated;
    return updated;
  }

  async deleteListing(id: string, sellerId: string, isAdmin = false): Promise<boolean> {
    const idx = this.listings.findIndex((l) => l.id === id);
    if (idx === -1) {
      throw new Error("यादी सापडली नाही (Listing not found)");
    }

    const existing = this.listings[idx];
    if (existing.seller_id !== sellerId && !isAdmin) {
      throw new Error("आपल्याला ही यादी हटवण्याची परवानगी नाही (Unauthorized)");
    }

    // Soft delete: set status to removed
    this.listings[idx] = {
      ...existing,
      status: "removed",
      updated_at: new Date().toISOString(),
    };
    return true;
  }

  async getEnquiries(params: {
    listingId?: string;
    buyerId?: string;
    sellerId?: string;
  }): Promise<MarketplaceEnquiry[]> {
    let result = [...this.enquiries];

    if (params.listingId) {
      result = result.filter((e) => e.listing_id === params.listingId);
    }
    if (params.buyerId) {
      result = result.filter((e) => e.buyer_id === params.buyerId);
    }
    if (params.sellerId) {
      result = result.filter((e) => e.seller_id === params.sellerId);
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }

  async getEnquiryById(id: string, userId: string, isAdmin = false): Promise<MarketplaceEnquiry | null> {
    const enquiry = this.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;

    // Enquiries are only visible to the buyer (sender) or seller (recipient) or admin
    if (enquiry.buyer_id !== userId && enquiry.seller_id !== userId && !isAdmin) {
      throw new Error("आपल्याला ही चौकशी पाहण्याची परवानगी नाही (Unauthorized)");
    }

    return enquiry;
  }

  async createEnquiry(input: CreateEnquiryInput, buyer: BuyerInfo): Promise<MarketplaceEnquiry> {
    const listing = this.listings.find((l) => l.id === input.listingId);
    if (!listing || listing.status === "removed") {
      throw new Error("यादी सापडली नाही (Listing not found)");
    }

    // Prevent self-enquiry
    if (buyer.id === listing.seller_id) {
      throw new Error("स्वतःच्या यादीवर चौकशी करता येत नाही (Cannot enquire on your own listing)");
    }

    if (input.proposedQuantity <= 0) {
      throw new Error("मागणी केलेले प्रमाण शून्य किंवा ऋण असू शकत नाही (Quantity must be positive)");
    }

    const newEnquiry: MarketplaceEnquiry = {
      id: crypto.randomUUID(),
      listing_id: input.listingId,
      buyer_id: buyer.id,
      seller_id: listing.seller_id,
      proposed_quantity: input.proposedQuantity,
      proposed_price_per_unit: input.proposedPricePerUnit || null,
      buyer_message: input.buyerMessage,
      buyer_phone: input.buyerPhone || buyer.phone_number || null,
      contact_preference: input.contactPreference || "phone",
      status: "new",
      status_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      listing,
      buyer,
      seller: listing.seller,
    };

    this.enquiries.unshift(newEnquiry);
    return newEnquiry;
  }

  async updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus,
    notes: string | undefined,
    userId: string,
    isAdmin = false
  ): Promise<MarketplaceEnquiry> {
    const idx = this.enquiries.findIndex((e) => e.id === enquiryId);
    if (idx === -1) {
      throw new Error("चौकशी सापडली नाही (Enquiry not found)");
    }

    const existing = this.enquiries[idx];

    // Status can be updated by the seller, or by the buyer if closing/declining
    const isSeller = existing.seller_id === userId;
    const isBuyer = existing.buyer_id === userId;

    if (!isSeller && !isBuyer && !isAdmin) {
      throw new Error("आपल्याला ही चौकशी अद्ययावत करण्याची परवानगी नाही (Unauthorized)");
    }

    // Buyers can only mark it as 'closed'
    if (isBuyer && !isSeller && !isAdmin && status !== "closed") {
      throw new Error("खरेदीदार केवळ चौकशी बंद (closed) करू शकतात");
    }

    // Prevent invalid transitions from terminal states
    if (existing.status === "closed" && status !== "closed" && !isAdmin) {
      throw new Error("बंद केलेली चौकशी पुन्हा उघडता येत नाही (Cannot reopen closed enquiry)");
    }

    const updated: MarketplaceEnquiry = {
      ...existing,
      status,
      status_notes: notes !== undefined ? notes : existing.status_notes,
      updated_at: new Date().toISOString(),
    };

    this.enquiries[idx] = updated;
    return updated;
  }
}

export const mockMarketplaceRepository = new MockMarketplaceRepositoryImpl();
