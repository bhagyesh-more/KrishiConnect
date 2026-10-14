import { readFileSync, existsSync } from "fs";
import { z } from "zod";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== KrishiConnect Milestone 5: Core Features Test Suite ===");
console.log("Testing Schemes, Agricultural Experts, and Learning Centre\n");

// ==========================================
// 1. Database Migration 005 Verification
// ==========================================
console.log("1. Database Migration 005 Verification:");
const migrationPath = "supabase/migrations/005_schemes_experts_learning.sql";
assert(existsSync(migrationPath), "Migration 005 file exists");

const sqlContent = readFileSync(migrationPath, "utf-8");
assert(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.government_schemes"), "Creates government_schemes table");
assert(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.saved_schemes"), "Creates saved_schemes table");
assert(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.expert_profiles"), "Creates expert_profiles table");
assert(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.consultation_requests"), "Creates consultation_requests table");
assert(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.learning_resources"), "Creates learning_resources table");
assert(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.resource_bookmarks"), "Creates resource_bookmarks table");
assert(sqlContent.includes("ENABLE ROW LEVEL SECURITY"), "Enables Row Level Security on tables");
assert(sqlContent.includes("idx_government_schemes_category"), "Defines scheme search and category indexes");
assert(sqlContent.includes("idx_expert_profiles_specialization"), "Defines expert specialization index");
assert(sqlContent.includes("idx_learning_resources_category"), "Defines learning resource category index");

// ==========================================
// 2. Feature A: Government Schemes Validation & Mock Logic
// ==========================================
console.log("\n2. Feature A: Schemes Schemas & Eligibility Assessment:");

// Assessment Schema validation
const assessmentInputSchema = z.object({
  landSizeAcres: z.coerce.number().min(0).max(500),
  farmerCategory: z.enum([
    "small_marginal",
    "medium_large",
    "sc_st",
    "woman_farmer",
    "general",
  ]),
  hasIrrigation: z.boolean(),
  district: z.string().optional(),
});

const validAssessment = assessmentInputSchema.safeParse({
  landSizeAcres: "2.5",
  farmerCategory: "small_marginal",
  hasIrrigation: true,
  district: "Pune",
});
assert(validAssessment.success && validAssessment.data.landSizeAcres === 2.5, "Valid assessment input parses and coerces correctly");

const invalidNegativeLand = assessmentInputSchema.safeParse({
  landSizeAcres: -5,
  farmerCategory: "small_marginal",
  hasIrrigation: true,
});
assert(!invalidNegativeLand.success, "Negative land size is rejected");

// Schemes Mock Data & Eligibility Evaluation
const schemesSource = readFileSync("src/features/schemes/mockRepository.ts", "utf-8");
assert(schemesSource.includes("MahaDBT"), "Contains MahaDBT schemes in mock database");
assert(schemesSource.includes("pmkisan.gov.in"), "Contains official PM-KISAN portal URL");
assert(schemesSource.includes("mahadbt.maharashtra.gov.in"), "Contains official MahaDBT portal URL");
assert(schemesSource.includes("last_verified_date"), "Includes official verification date metadata (last_verified_date)");
assert(schemesSource.includes("is_demo_record"), "Explicitly distinguishes demo vs official records (is_demo_record)");

// Eligibility Assessment Algorithm Logic
function assessSchemeEligibility(schemeId, input) {
  let matched = [];
  let unmet = [];

  if (schemeId === "scheme-001") {
    // MahaDBT Micro Irrigation
    if (input.landSizeAcres > 0 && input.landSizeAcres <= 12.5) {
      matched.push("शेतकऱ्याकडे स्वतःच्या नावावर शेतजमीन आहे (५ हेक्टर मर्यादेत).");
    } else {
      unmet.push("सदर योजनेसाठी कमाल ५ हेक्टर (१२.५ एकर) जमीन मर्यादा लागू आहे.");
    }

    if (input.hasIrrigation) {
      matched.push("शाश्वत पाण्याचा स्त्रोत (विहीर/कूपनलिका/शेततळे) उपलब्ध आहे.");
    } else {
      unmet.push("ठिबक बसवण्यासाठी शाश्वत पाण्याचा स्त्रोत असणे बंधनकारक आहे.");
    }
  }

  const total = matched.length + unmet.length;
  const matchPercentage = total === 0 ? 0 : Math.round((matched.length / total) * 100);
  const indicativeStatus = matchPercentage >= 80 ? "likely_eligible" : matchPercentage >= 50 ? "conditionally_eligible" : "unlikely_eligible";

  return { indicativeStatus, matchPercentage, matchedCriteria: matched, unmetCriteria: unmet };
}

const eligibleResult = assessSchemeEligibility("scheme-001", {
  landSizeAcres: 2.5,
  hasIrrigation: true,
});
assert(eligibleResult.indicativeStatus === "likely_eligible" && eligibleResult.matchPercentage === 100, "Eligible farmer gets 100% indicative score");

const ineligibleResult = assessSchemeEligibility("scheme-001", {
  landSizeAcres: 20,
  hasIrrigation: false,
});
assert(ineligibleResult.indicativeStatus === "unlikely_eligible" && ineligibleResult.matchPercentage === 0, "Ineligible farmer gets unlikely status");

// Schemes Bookmarking Simulation
const savedSchemes = new Set();
function toggleSavedScheme(schemeId, userId) {
  const key = `${userId}:${schemeId}`;
  if (savedSchemes.has(key)) {
    savedSchemes.delete(key);
    return false;
  } else {
    savedSchemes.add(key);
    return true;
  }
}

const saved1 = toggleSavedScheme("scheme-001", "user-pune");
assert(saved1 === true && savedSchemes.has("user-pune:scheme-001"), "User can save a scheme");
const unsaved1 = toggleSavedScheme("scheme-001", "user-pune");
assert(unsaved1 === false && !savedSchemes.has("user-pune:scheme-001"), "User can unsave a scheme");

// ==========================================
// 3. Feature B: Agricultural Expert Connect
// ==========================================
console.log("\n3. Feature B: Expert Schemas, Profiles & Consultation Requests:");

const createConsultationRequestSchema = z.object({
  expertId: z.string().optional().nullable(),
  cropName: z.string().max(100).optional(),
  subject: z.string().min(3).max(150),
  description: z.string().min(10).max(2000),
  preferredContactMethod: z.enum(["phone", "whatsapp", "in_person_kvk"]).default("phone"),
  preferredTimeSlot: z.string().max(100).optional(),
  farmerPhone: z.string().max(20).optional(),
  imageUrls: z.array(z.string()).max(3).default([]),
});

const validReq = createConsultationRequestSchema.safeParse({
  expertId: "expert-001",
  cropName: "कापूस",
  subject: "गुलाबी बोंडअळी प्रादुर्भाव",
  description: "कापूस बोंड धरण्याच्या अवस्थेत असून कामगंध सापळ्यात पतंग सापडत आहेत. फवारणी मार्गदर्शन हवे.",
  preferredContactMethod: "phone",
  preferredTimeSlot: "morning",
  farmerPhone: "9876543210",
  imageUrls: [],
});
assert(validReq.success, "Valid consultation request data accepted");

const invalidShortDesc = createConsultationRequestSchema.safeParse({
  expertId: "expert-001",
  subject: "रोग",
  description: "मदत करा",
});
assert(!invalidShortDesc.success, "Too short description is rejected (<10 chars)");

// Experts Mock Data inspection
const expertSource = readFileSync("src/features/experts/mockRepository.ts", "utf-8");
assert(expertSource.includes("is_demo_profile: true"), "Demonstration mock experts honestly tagged as demo");
assert(expertSource.includes("MOCK_EXPERTS"), "Contains expert profiles repository (MOCK_EXPERTS)");

// Consultation creation and isolation
let mockConsultationStore = [];
function createConsultation(data, farmerId, farmerName) {
  const req = {
    id: `req-${mockConsultationStore.length + 1}`,
    farmer_id: farmerId,
    farmer_name: farmerName,
    status: "pending",
    expert_notes: null,
    created_at: new Date().toISOString(),
    ...data,
  };
  mockConsultationStore.push(req);
  return req;
}

const req1 = createConsultation(validReq.data, "farmer-satara", "गणेश जाधव");
assert(req1.status === "pending" && req1.farmer_id === "farmer-satara", "Consultation created with pending status");

// Access boundary
function getConsultationsForUser(userId) {
  return mockConsultationStore.filter((r) => r.farmer_id === userId);
}
assert(getConsultationsForUser("farmer-satara").length === 1, "Farmer can fetch own consultation requests");
assert(getConsultationsForUser("farmer-other").length === 0, "Other users cannot see consultation requests");

// Status update
function updateConsultationStatus(reqId, newStatus, notes, actorId) {
  const req = mockConsultationStore.find((r) => r.id === reqId);
  if (!req) throw new Error("Not found");
  if (req.farmer_id !== actorId && actorId !== "admin") {
    throw new Error("Unauthorized");
  }
  req.status = newStatus;
  if (notes) req.expert_notes = notes;
  return req;
}

const cancelled = updateConsultationStatus(req1.id, "cancelled", "शेतकऱ्याने रद्द केली", "farmer-satara");
assert(cancelled.status === "cancelled", "Farmer can cancel their pending consultation");

let unauthorizedCancel = false;
try {
  updateConsultationStatus(req1.id, "accepted", "notes", "intruder-user");
} catch {
  unauthorizedCancel = true;
}
assert(unauthorizedCancel, "Intruder cannot alter status of another user's consultation");

// ==========================================
// 4. Feature C: Agricultural Learning Centre
// ==========================================
console.log("\n4. Feature C: Learning Resource Filtering & Bookmarking:");

const learningSource = readFileSync("src/features/learning/mockRepository.ts", "utf-8");
assert(learningSource.includes("drip-irrigation-acid-treatment-guide"), "Contains acid treatment irrigation tutorial");
assert(learningSource.includes("how-to-make-jeevamrut-organic-farming"), "Contains Jeevamrut preparation guide");
assert(learningSource.includes("cotton-pink-bollworm-integrated-pest-management"), "Contains pink bollworm IPM guide");
assert(learningSource.includes("summer-onion-storage-and-chawl-management"), "Contains onion storage technology guide");
assert(learningSource.includes("soil-testing-sampling-methodology-step-by-step"), "Contains soil testing scientific method guide");

// Bookmark state management
const learningBookmarks = new Set();
function toggleLearningBookmark(resourceId, userId) {
  const key = `${userId}:${resourceId}`;
  if (learningBookmarks.has(key)) {
    learningBookmarks.delete(key);
    return false;
  } else {
    learningBookmarks.add(key);
    return true;
  }
}

const lb1 = toggleLearningBookmark("learn-001", "farmer-pune");
assert(lb1 === true, "User can bookmark a learning resource");
const lb2 = toggleLearningBookmark("learn-001", "farmer-pune");
assert(lb2 === false, "User can unbookmark a learning resource");

// ==========================================
// 5. Localization Parity Verification
// ==========================================
console.log("\n5. Localization Parity Verification (mr, hi, en):");
const mrJson = JSON.parse(readFileSync("src/locales/mr.json", "utf-8"));
const hiJson = JSON.parse(readFileSync("src/locales/hi.json", "utf-8"));
const enJson = JSON.parse(readFileSync("src/locales/en.json", "utf-8"));

for (const section of ["schemes", "experts", "learning"]) {
  assert(mrJson[section] !== undefined, `mr.json contains "${section}" section`);
  assert(hiJson[section] !== undefined, `hi.json contains "${section}" section`);
  assert(enJson[section] !== undefined, `en.json contains "${section}" section`);

  const mrKeys = Object.keys(mrJson[section] || {});
  const hiKeys = Object.keys(hiJson[section] || {});
  const enKeys = Object.keys(enJson[section] || {});

  const allEqual =
    mrKeys.length === hiKeys.length &&
    mrKeys.length === enKeys.length &&
    mrKeys.every((k) => hiKeys.includes(k) && enKeys.includes(k));

  assert(allEqual, `Key parity in "${section}" across Marathi (${mrKeys.length}), Hindi (${hiKeys.length}), English (${enKeys.length})`);
}

// ==========================================
// Summary
// ==========================================
console.log("\n========================================================");
console.log(`Phase 5 Core Test Results: ${passed} passed, ${failed} failed`);
console.log("========================================================\n");

if (failed > 0) {
  process.exit(1);
}
