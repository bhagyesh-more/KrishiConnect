import { readFileSync } from "fs";
import { z } from "zod";

// Schemas to test
const farmSchema = z.object({
  farmName: z.string().min(2).max(100),
  totalAreaAcres: z.number().positive().max(10000),
  irrigationSource: z.array(z.string()).default([]),
  soilType: z.string().optional(),
  locationDistrict: z.string().min(1),
  locationTaluka: z.string().optional(),
});

const fieldSchema = z.object({
  farmId: z.string().uuid(),
  fieldName: z.string().min(1).max(100),
  areaAcres: z.number().positive().max(10000),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
});

const cropRecordSchema = z.object({
  fieldId: z.string().uuid(),
  guideId: z.string().uuid().optional().or(z.literal("")),
  customCropName: z.string().optional(),
  variety: z.string().optional(),
  season: z.enum(["Kharif", "Rabi", "Zaid", "Perennial"]).default("Kharif"),
  sowingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expectedHarvestDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  status: z.enum(["planned", "sown", "growing", "harvesting", "completed", "abandoned"]).default("sown"),
  notes: z.string().max(500).optional(),
});

const cropTaskSchema = z.object({
  cropRecordId: z.string().uuid(),
  title: z.string().min(2).max(150),
  description: z.string().max(500).optional(),
  category: z.enum(["irrigation", "fertilizer", "pesticide", "weeding", "harvest", "scouting"]),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

console.log("=== Running Phase 3 Tests ===");

// 1. Farm Schema Tests
console.log("\n1. Testing farmSchema:");
const validFarm = farmSchema.safeParse({
  farmName: "माझे शेत",
  totalAreaAcres: 5.5,
  locationDistrict: "पुणे",
  locationTaluka: "हवेली",
  soilType: "काळी जमीन",
  irrigationSource: ["विहीर", "ठिबक"],
});
assert(validFarm.success, "Valid farm input succeeds");

const invalidFarmArea = farmSchema.safeParse({
  farmName: "माझे शेत",
  totalAreaAcres: -2,
  locationDistrict: "पुणे",
});
assert(!invalidFarmArea.success, "Negative farm acreage rejected");

const invalidFarmName = farmSchema.safeParse({
  farmName: "A",
  totalAreaAcres: 5,
  locationDistrict: "पुणे",
});
assert(!invalidFarmName.success, "Farm name under 2 chars rejected");

// 2. Field Schema Tests
console.log("\n2. Testing fieldSchema:");
const validField = fieldSchema.safeParse({
  farmId: "11111111-1111-4111-a111-111111111111",
  fieldName: "विहिरीजवळचा तुकडा",
  areaAcres: 2.5,
  soilType: "काळी कसदार",
  irrigationType: "ठिबक सिंचन",
});
assert(validField.success, "Valid field input succeeds");

const invalidFieldUuid = fieldSchema.safeParse({
  farmId: "not-a-uuid",
  fieldName: "तुकडा १",
  areaAcres: 2.5,
});
assert(!invalidFieldUuid.success, "Non-UUID farmId rejected");

// 3. Crop Record Schema Tests
console.log("\n3. Testing cropRecordSchema:");
const validCrop = cropRecordSchema.safeParse({
  fieldId: "11111111-1111-4111-a111-111111111111",
  guideId: "00000000-0000-4000-a000-000000000001",
  variety: "JS 335",
  season: "Kharif",
  sowingDate: "2026-06-25",
  expectedHarvestDate: "2026-10-05",
  status: "growing",
});
assert(validCrop.success, "Valid crop record input succeeds");

const invalidCropDate = cropRecordSchema.safeParse({
  fieldId: "11111111-1111-4111-a111-111111111111",
  sowingDate: "25/06/2026", // Invalid format
});
assert(!invalidCropDate.success, "Invalid sowing date format rejected");

// 4. Crop Task Schema Tests
console.log("\n4. Testing cropTaskSchema:");
const validTask = cropTaskSchema.safeParse({
  cropRecordId: "22222222-2222-4222-a222-222222222222",
  title: "सूक्ष्म अन्नद्रव्य फवारणी",
  category: "fertilizer",
  dueDate: "2026-07-20",
  priority: "high",
});
assert(validTask.success, "Valid crop task input succeeds");

const invalidTaskCat = cropTaskSchema.safeParse({
  cropRecordId: "22222222-2222-4222-a222-222222222222",
  title: "काम",
  category: "unknown_category",
  dueDate: "2026-07-20",
});
assert(!invalidTaskCat.success, "Invalid task category rejected");

// 5. Migration Idempotency & SQL Schema Checks
console.log("\n5. Testing 002_crops_and_farms.sql migration integrity:");
const migrationSql = readFileSync("supabase/migrations/002_crops_and_farms.sql", "utf8");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.farms"), "Table farms created safely IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.farm_fields"), "Table farm_fields created safely IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.crop_guides"), "Table crop_guides created safely IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.crop_records"), "Table crop_records created safely IF NOT EXISTS");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS public.crop_tasks"), "Table crop_tasks created safely IF NOT EXISTS");
assert(migrationSql.includes("ENABLE ROW LEVEL SECURITY"), "Row Level Security enabled");
assert(migrationSql.includes("ON CONFLICT (id) DO UPDATE"), "Crop guide seed data is idempotent with ON CONFLICT (id) DO UPDATE");

// Check the 5 required crops
assert(migrationSql.includes("SOYBEAN_JS335"), "Soybean (JS 335) present in seed data");
assert(migrationSql.includes("COTTON_HYBRID"), "Cotton present in seed data");
assert(migrationSql.includes("SUGARCANE_CO86032"), "Sugarcane present in seed data");
assert(migrationSql.includes("ONION_RABI"), "Onion present in seed data");
assert(migrationSql.includes("WHEAT_RABI"), "Wheat present in seed data");

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
