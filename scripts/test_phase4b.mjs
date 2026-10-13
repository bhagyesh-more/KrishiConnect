import { readFileSync } from "fs";
import { z } from "zod";

const AllowedCategories = [
  "grains",
  "pulses",
  "vegetables",
  "fruits",
  "spices",
  "oilseeds",
  "flowers",
  "inputs",
  "other",
];

const AllowedPriceUnits = [
  "per_quintal",
  "per_kg",
  "per_crate",
  "per_ton",
  "per_dozen",
];

const AllowedListingStatuses = [
  "active",
  "paused",
  "sold_out",
  "removed",
];

const AllowedEnquiryStatuses = [
  "new",
  "contacted",
  "accepted",
  "declined",
  "closed",
];

const AllowedContactPreferences = ["phone", "whatsapp", "visit"];

const createListingSchema = z.object({
  commodityName: z.string().min(2).max(100),
  variety: z.string().max(100).optional(),
  category: z.enum(AllowedCategories),
  description: z.string().max(2000).optional(),
  quantity: z.number().positive(),
  quantityUnit: z.enum(AllowedPriceUnits),
  pricePerUnit: z.number().positive(),
  priceUnit: z.enum(AllowedPriceUnits),
  minimumOrderQty: z.number().positive().default(1),
  locationDistrict: z.string().min(2),
  locationTaluka: z.string().max(50).optional(),
  harvestDate: z.string().optional(),
  imageUrls: z.array(z.string()).max(5).default([]),
  isOrganic: z.boolean().default(false),
});

const createEnquirySchema = z.object({
  listingId: z.string().min(1),
  proposedQuantity: z.number().positive(),
  proposedPricePerUnit: z.number().positive().optional(),
  buyerMessage: z.string().min(5).max(1000),
  buyerPhone: z.string().max(20).optional(),
  contactPreference: z.enum(AllowedContactPreferences).default("phone"),
});

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

console.log("=== Running Milestone 4B (Agricultural Marketplace) Tests ===");

// 1. Listing Schema Tests
console.log("\n1. Testing createListingSchema:");
const validListing = createListingSchema.safeParse({
  commodityName: "लाल कांदा (Lasalgaon Onion)",
  variety: "गावराण गरवा",
  category: "vegetables",
  quantity: 50,
  quantityUnit: "per_quintal",
  pricePerUnit: 2600,
  priceUnit: "per_quintal",
  minimumOrderQty: 5,
  locationDistrict: "नाशिक (Nashik)",
  locationTaluka: "निफाड",
  harvestDate: "2026-04-10",
  isOrganic: false,
});
assert(validListing.success, "Valid produce listing input succeeds");

const invalidZeroQty = createListingSchema.safeParse({
  commodityName: "लाल कांदा",
  category: "vegetables",
  quantity: 0,
  quantityUnit: "per_quintal",
  pricePerUnit: 2600,
  priceUnit: "per_quintal",
  locationDistrict: "नाशिक",
});
assert(!invalidZeroQty.success, "Zero quantity is rejected");

const invalidNegPrice = createListingSchema.safeParse({
  commodityName: "लाल कांदा",
  category: "vegetables",
  quantity: 50,
  quantityUnit: "per_quintal",
  pricePerUnit: -100,
  priceUnit: "per_quintal",
  locationDistrict: "नाशिक",
});
assert(!invalidNegPrice.success, "Negative price is rejected");

const invalidShortName = createListingSchema.safeParse({
  commodityName: "क",
  category: "vegetables",
  quantity: 50,
  quantityUnit: "per_quintal",
  pricePerUnit: 2600,
  priceUnit: "per_quintal",
  locationDistrict: "नाशिक",
});
assert(!invalidShortName.success, "Single character commodity name is rejected");

const invalidCategory = createListingSchema.safeParse({
  commodityName: "सोयाबीन",
  category: "automotive",
  quantity: 50,
  quantityUnit: "per_quintal",
  pricePerUnit: 4600,
  priceUnit: "per_quintal",
  locationDistrict: "लातूर",
});
assert(!invalidCategory.success, "Invalid category enum is rejected");

// 2. Enquiry Schema Tests
console.log("\n2. Testing createEnquirySchema:");
const validEnquiry = createEnquirySchema.safeParse({
  listingId: "00000000-0000-0000-0000-000000000101",
  proposedQuantity: 25,
  proposedPricePerUnit: 2550,
  buyerMessage: "आम्हाला २५ क्विंटल चांगल्या प्रतीचा माल हवा आहे. बांधावर गाडी भरून घेऊ.",
  buyerPhone: "+91 98200 54321",
  contactPreference: "phone",
});
assert(validEnquiry.success, "Valid buyer enquiry input succeeds");

const invalidZeroEnquiryQty = createEnquirySchema.safeParse({
  listingId: "00000000-0000-0000-0000-000000000101",
  proposedQuantity: 0,
  buyerMessage: "आम्हाला माल हवा आहे.",
});
assert(!invalidZeroEnquiryQty.success, "Zero enquiry quantity is rejected");

const invalidShortMessage = createEnquirySchema.safeParse({
  listingId: "00000000-0000-0000-0000-000000000101",
  proposedQuantity: 10,
  buyerMessage: "हवा",
});
assert(!invalidShortMessage.success, "Short message (< 5 chars) is rejected");

// 3. Mock Repository Listing & Ownership Logic
console.log("\n3. Testing Mock Marketplace Repository Listing Workflows:");

// Test In-memory listing store
let mockListings = [
  {
    id: "l-1",
    seller_id: "seller-ramesh",
    commodity_name: "कांदा",
    price_per_unit: 2600,
    quantity_available: 50,
    status: "active",
  },
];

// Test update with ownership check
function updateListing(id, updates, userId) {
  const item = mockListings.find((l) => l.id === id);
  if (!item) throw new Error("Listing not found");
  if (item.seller_id !== userId) throw new Error("Unauthorized");
  Object.assign(item, updates);
  return item;
}

// Test unauthorized edit
let unauthorizedEditThrown = false;
try {
  updateListing("l-1", { price_per_unit: 3000 }, "seller-other");
} catch {
  unauthorizedEditThrown = true;
}
assert(unauthorizedEditThrown, "Non-owner cannot update listing (throws unauthorized)");

// Test authorized edit
const updatedListing = updateListing("l-1", { price_per_unit: 2750 }, "seller-ramesh");
assert(updatedListing.price_per_unit === 2750, "Listing owner can update asking price");

// Test Status transitions
function updateListingStatus(id, newStatus, userId) {
  const item = mockListings.find((l) => l.id === id);
  if (!item) throw new Error("Listing not found");
  if (item.seller_id !== userId) throw new Error("Unauthorized");
  item.status = newStatus;
  return item;
}

updateListingStatus("l-1", "paused", "seller-ramesh");
assert(mockListings[0].status === "paused", "Listing owner can pause listing");

updateListingStatus("l-1", "sold_out", "seller-ramesh");
assert(mockListings[0].status === "sold_out", "Listing owner can mark listing sold_out");

updateListingStatus("l-1", "active", "seller-ramesh");
assert(mockListings[0].status === "active", "Listing owner can reactivate listing");

// 4. Buyer Enquiry & Self-Enquiry Prevention
console.log("\n4. Testing Enquiry Workflows & Self-Enquiry Prevention:");

let mockEnquiries = [];

function createEnquiry(listingId, buyerId, proposedQuantity, message) {
  const listing = mockListings.find((l) => l.id === listingId);
  if (!listing) throw new Error("Listing not found");
  if (listing.seller_id === buyerId) {
    throw new Error("Cannot enquire on your own listing");
  }
  const enq = {
    id: `e-${mockEnquiries.length + 1}`,
    listing_id: listingId,
    seller_id: listing.seller_id,
    buyer_id: buyerId,
    proposed_quantity: proposedQuantity,
    buyer_message: message,
    status: "new",
  };
  mockEnquiries.push(enq);
  return enq;
}

// Attempt self enquiry
let selfEnquiryPrevented = false;
try {
  createEnquiry("l-1", "seller-ramesh", 10, "मी स्वतः खरेदी करू इच्छितो");
} catch {
  selfEnquiryPrevented = true;
}
assert(selfEnquiryPrevented, "Self-enquiry by listing owner is strictly prevented");

// Valid buyer enquiry
const enq1 = createEnquiry("l-1", "buyer-sunil", 20, "कृपया नमुना पाठवा");
assert(enq1.status === "new", "Buyer successfully submits enquiry with status 'new'");

// Enquiry visibility test
function getEnquiry(enquiryId, requestingUserId) {
  const enq = mockEnquiries.find((e) => e.id === enquiryId);
  if (!enq) return null;
  if (enq.buyer_id !== requestingUserId && enq.seller_id !== requestingUserId) {
    throw new Error("Unauthorized visibility");
  }
  return enq;
}

let unauthorizedVisibilityBlocked = false;
try {
  getEnquiry(enq1.id, "unrelated-user");
} catch {
  unauthorizedVisibilityBlocked = true;
}
assert(unauthorizedVisibilityBlocked, "Enquiry visibility is restricted to buyer and seller");
assert(getEnquiry(enq1.id, "seller-ramesh") !== null, "Seller can view incoming enquiry");
assert(getEnquiry(enq1.id, "buyer-sunil") !== null, "Buyer can view sent enquiry");

// 5. Enquiry Status Transitions
console.log("\n5. Testing Enquiry Status Transitions:");

function updateEnquiryStatus(enquiryId, newStatus, userId) {
  const enq = mockEnquiries.find((e) => e.id === enquiryId);
  if (!enq) throw new Error("Not found");
  const isSeller = enq.seller_id === userId;
  const isBuyer = enq.buyer_id === userId;
  if (!isSeller && !isBuyer) throw new Error("Unauthorized");

  // Buyer can only close
  if (isBuyer && !isSeller && newStatus !== "closed") {
    throw new Error("Buyer can only close enquiry");
  }

  // Terminal state check
  if (enq.status === "closed" && newStatus !== "closed") {
    throw new Error("Cannot reopen closed enquiry");
  }

  enq.status = newStatus;
  return enq;
}

// Seller transitions: new -> contacted
updateEnquiryStatus(enq1.id, "contacted", "seller-ramesh");
assert(enq1.status === "contacted", "Seller updates enquiry status to 'contacted'");

// Seller transitions: contacted -> accepted
updateEnquiryStatus(enq1.id, "accepted", "seller-ramesh");
assert(enq1.status === "accepted", "Seller updates enquiry status to 'accepted'");

// Buyer closes enquiry
updateEnquiryStatus(enq1.id, "closed", "buyer-sunil");
assert(enq1.status === "closed", "Buyer can mark completed enquiry as 'closed'");

// Attempt to reopen closed enquiry
let reopenBlocked = false;
try {
  updateEnquiryStatus(enq1.id, "new", "seller-ramesh");
} catch {
  reopenBlocked = true;
}
assert(reopenBlocked, "Reopening closed enquiry is blocked");

// 6. SQL Migration 004 Integrity
console.log("\n6. Testing SQL Migration 004 Integrity:");
const sql004 = readFileSync("supabase/migrations/004_marketplace.sql", "utf-8");

assert(sql004.includes("CREATE TABLE IF NOT EXISTS public.product_listings"), "004_marketplace.sql defines product_listings table");
assert(sql004.includes("CREATE TABLE IF NOT EXISTS public.marketplace_enquiries"), "004_marketplace.sql defines marketplace_enquiries table");
assert(sql004.includes("commodity_category AS ENUM"), "004_marketplace.sql defines commodity_category enum");
assert(sql004.includes("price_unit AS ENUM"), "004_marketplace.sql defines price_unit enum");
assert(sql004.includes("listing_status AS ENUM"), "004_marketplace.sql defines listing_status enum");
assert(sql004.includes("enquiry_status AS ENUM"), "004_marketplace.sql defines enquiry_status enum");
assert(sql004.includes("chk_no_self_enquiry"), "004_marketplace.sql includes self-enquiry constraint (buyer_id <> seller_id)");
assert(sql004.includes("trg_product_listings_updated_at"), "004_marketplace.sql includes updated_at trigger for product_listings");
assert(sql004.includes("trg_marketplace_enquiries_updated_at"), "004_marketplace.sql includes updated_at trigger for marketplace_enquiries");
assert(sql004.includes("ALTER TABLE public.product_listings ENABLE ROW LEVEL SECURITY"), "004_marketplace.sql enables RLS on product_listings");
assert(sql004.includes("ALTER TABLE public.marketplace_enquiries ENABLE ROW LEVEL SECURITY"), "004_marketplace.sql enables RLS on marketplace_enquiries");
assert(sql004.includes("Public can view active listings"), "004_marketplace.sql has SELECT policy for active listings");
assert(sql004.includes("Buyers and sellers can view their own enquiries"), "004_marketplace.sql has enquiry visibility RLS policy");

// 7. Localization Key Parity
console.log("\n7. Testing Localization Key Parity (mr, hi, en):");
const mr = JSON.parse(readFileSync("src/locales/mr.json", "utf-8"));
const hi = JSON.parse(readFileSync("src/locales/hi.json", "utf-8"));
const en = JSON.parse(readFileSync("src/locales/en.json", "utf-8"));

assert(Boolean(mr.marketplace), "mr.json contains marketplace namespace");
assert(Boolean(hi.marketplace), "hi.json contains marketplace namespace");
assert(Boolean(en.marketplace), "en.json contains marketplace namespace");

const mrKeys = Object.keys(mr.marketplace).sort();
const hiKeys = Object.keys(hi.marketplace).sort();
const enKeys = Object.keys(en.marketplace).sort();

assert(mrKeys.length >= 35, `mr.json marketplace contains comprehensive keys (${mrKeys.length})`);
assert(JSON.stringify(mrKeys) === JSON.stringify(hiKeys), "mr.json and hi.json marketplace keys are identical");
assert(JSON.stringify(mrKeys) === JSON.stringify(enKeys), "mr.json and en.json marketplace keys are identical");

// Summary
console.log(`\n========================================`);
console.log(`Total tests: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
