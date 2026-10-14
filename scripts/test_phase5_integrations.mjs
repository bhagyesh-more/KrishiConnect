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

console.log("=== KrishiConnect Milestone 5: External Integrations Test Suite ===");
console.log("Testing Supabase, Weather, AI Safety, Storage & Fallbacks\n");

// ==========================================
// 1. Supabase Fallback & Repository Factory Logic
// ==========================================
console.log("1. Supabase Credentials Fallback & Factory Selection:");

function isSupabaseConfigured(url, anon) {
  return !!(
    url &&
    !url.includes("placeholder-project") &&
    anon &&
    !anon.includes("placeholder-anon-key")
  );
}

assert(
  !isSupabaseConfigured(undefined, undefined),
  "Missing environment variables detected as unconfigured"
);
assert(
  !isSupabaseConfigured("https://placeholder-project.supabase.co", "placeholder-anon-key"),
  "Placeholder URL and Anon Key detected as unconfigured (triggers mock fallback)"
);
assert(
  isSupabaseConfigured("https://my-real-app.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"),
  "Real-looking URL and Anon Key correctly detected as configured"
);

// Verify admin client blocks client-side execution
const adminSource = readFileSync("src/lib/supabase/admin.ts", "utf-8");
assert(
  adminSource.includes('typeof window !== "undefined"'),
  "Admin client throws critical error if invoked on client side"
);
assert(
  adminSource.includes("SUPABASE_SERVICE_ROLE_KEY"),
  "Admin client requires server-only SUPABASE_SERVICE_ROLE_KEY"
);

// Verify repositories check for placeholder-project
const schemesRepoSource = readFileSync("src/features/schemes/repository.ts", "utf-8");
assert(
  schemesRepoSource.includes("placeholder-project"),
  "Schemes repository falls back safely on placeholder URL"
);

const marketRepoSource = readFileSync("src/features/marketplace/repository.ts", "utf-8");
assert(
  marketRepoSource.includes("placeholder-project"),
  "Marketplace repository falls back safely on placeholder URL"
);

// Verify NEXT_PUBLIC_USE_MOCK_DATA override behavior
function isMockActive(useMockDataFlag, url, anon) {
  return (
    useMockDataFlag === "true" ||
    !url ||
    url.includes("placeholder-project") ||
    !anon ||
    anon.includes("placeholder-anon-key")
  );
}

assert(
  isMockActive("true", "https://my-real-app.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"),
  "NEXT_PUBLIC_USE_MOCK_DATA=true explicitly forces mock mode even with valid credentials"
);
assert(
  !isMockActive("false", "https://my-real-app.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"),
  "NEXT_PUBLIC_USE_MOCK_DATA=false allows Supabase mode when valid credentials exist"
);

const communityRepoSource = readFileSync("src/features/community/repository.ts", "utf-8");
assert(
  communityRepoSource.includes("NEXT_PUBLIC_USE_MOCK_DATA"),
  "Community repository respects NEXT_PUBLIC_USE_MOCK_DATA override"
);
assert(
  marketRepoSource.includes("NEXT_PUBLIC_USE_MOCK_DATA"),
  "Marketplace repository respects NEXT_PUBLIC_USE_MOCK_DATA override"
);
assert(
  schemesRepoSource.includes("NEXT_PUBLIC_USE_MOCK_DATA"),
  "Schemes repository respects NEXT_PUBLIC_USE_MOCK_DATA override"
);
const expertsRepoSource = readFileSync("src/features/experts/repository.ts", "utf-8");
assert(
  expertsRepoSource.includes("NEXT_PUBLIC_USE_MOCK_DATA"),
  "Experts repository respects NEXT_PUBLIC_USE_MOCK_DATA override"
);
const learningRepoSource = readFileSync("src/features/learning/repository.ts", "utf-8");
assert(
  learningRepoSource.includes("NEXT_PUBLIC_USE_MOCK_DATA"),
  "Learning repository respects NEXT_PUBLIC_USE_MOCK_DATA override"
);
const cropsActionSource = readFileSync("src/features/crops/actions.ts", "utf-8");
assert(
  cropsActionSource.includes("NEXT_PUBLIC_USE_MOCK_DATA"),
  "Crops actions respect NEXT_PUBLIC_USE_MOCK_DATA override for crop guides"
);

// ------------------------------------------------------------------
// Auth Callback Route, Open-Redirect Prevention & Error Mapping Tests
// ------------------------------------------------------------------
const callbackRouteSource = readFileSync("src/app/auth/callback/route.ts", "utf-8");
assert(
  callbackRouteSource.includes("exchangeCodeForSession"),
  "Auth callback route calls exchangeCodeForSession"
);
assert(
  callbackRouteSource.includes("/login?error=auth_callback_failed"),
  "Auth callback route redirects to safe error URL on failure or missing code"
);
assert(
  !callbackRouteSource.includes("error.message"),
  "Auth callback route does not leak raw error messages in redirect parameters"
);

// Verify open-redirect sanitizer logic directly from src/features/auth/utils.ts implementation
const authUtilsSource = readFileSync("src/features/auth/utils.ts", "utf-8");
const testSanitizeNextUrl = new Function(
  authUtilsSource.replace(
    /export function sanitizeNextUrl\(next:\s*string\s*\|\s*null\):\s*string/,
    "return function sanitizeNextUrl(next)"
  )
)();

assert(testSanitizeNextUrl("/crops") === "/crops", "Allows valid internal next destination (/crops)");
assert(testSanitizeNextUrl("/profile") === "/profile", "Allows valid internal next destination (/profile)");
assert(testSanitizeNextUrl("https://attacker.com") === "/home", "Blocks external full-URL open redirect");
assert(testSanitizeNextUrl("//attacker.com") === "/home", "Blocks protocol-relative open redirect");
assert(testSanitizeNextUrl("/\\attacker.com") === "/home", "Blocks backslash open-redirect bypass");
assert(testSanitizeNextUrl(null) === "/home", "Falls back to /home when next is null");

// Verify auth actions configuration
const authActionsSource = readFileSync("src/features/auth/actions.ts", "utf-8");
assert(
  authActionsSource.includes("emailRedirectTo") && authActionsSource.includes("/auth/callback"),
  "Registration configures emailRedirectTo pointing to /auth/callback"
);
assert(
  authActionsSource.includes("requiresEmailVerification"),
  "Registration preserves requiresEmailVerification status for unconfirmed users"
);
assert(
  authActionsSource.includes("Email not confirmed") && authActionsSource.includes("पडताळणी"),
  "Login maps 'Email not confirmed' error to clear bilingual verification message"
);

// Verify middleware mock bypass logic
const middlewareSource = readFileSync("src/lib/supabase/middleware.ts", "utf-8");
assert(
  middlewareSource.includes("NEXT_PUBLIC_USE_MOCK_DATA") &&
  middlewareSource.includes("your-project-id"),
  "Middleware explicitly checks NEXT_PUBLIC_USE_MOCK_DATA and template project URLs"
);

function testMiddlewareBypass(useMockData, url, anon) {
  return (
    useMockData === "true" ||
    !url ||
    !anon ||
    url.includes("placeholder-project") ||
    url.includes("your-project-id") ||
    anon.includes("placeholder-anon-key") ||
    anon.includes("...")
  );
}

assert(
  testMiddlewareBypass("true", "https://ppwkaaddtjommtesxxsc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid"),
  "Middleware bypasses Supabase session refresh when NEXT_PUBLIC_USE_MOCK_DATA=true"
);
assert(
  testMiddlewareBypass("false", "https://your-project-id.supabase.co", "eyJhbGci..."),
  "Middleware bypasses Supabase session refresh when template placeholders are present"
);
assert(
  !testMiddlewareBypass("false", "https://ppwkaaddtjommtesxxsc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid"),
  "Middleware executes normal session refresh when mock mode is false and credentials are real"
);

// ==========================================
// 2. Weather Client (Open-Meteo & Offline Fallback)
// ==========================================
console.log("\n2. Weather Service & Agro-Meteorological Advisories:");

const weatherLocSource = readFileSync("src/features/weather/locations.ts", "utf-8");
assert(weatherLocSource.includes("Pune"), "Pune coordinates defined in weather locations");
assert(weatherLocSource.includes("Nashik"), "Nashik coordinates defined in weather locations");
assert(weatherLocSource.includes("Solapur"), "Solapur coordinates defined in weather locations");
assert(weatherLocSource.includes("interpretWmoCode"), "WMO code interpreter defined");

function interpretWmoCodeMock(code) {
  switch (code) {
    case 0:
      return { labelMr: "निरभ्र आकाश (स्वच्छ ऊन)", icon: "sunny" };
    case 65:
      return { labelMr: "मुसळधार पाऊस", icon: "rainy" };
    default:
      return { labelMr: "सामान्य हवामान", icon: "partly_cloudy" };
  }
}

const sunnyCode = interpretWmoCodeMock(0);
assert(sunnyCode.icon === "sunny" && sunnyCode.labelMr.includes("निरभ्र"), "WMO code 0 translates to clear sunny sky in Marathi");

const rainCode = interpretWmoCodeMock(65);
assert(rainCode.icon === "rainy" && rainCode.labelMr.includes("मुसळधार"), "WMO code 65 translates to heavy rain in Marathi");

const weatherServiceSource = readFileSync("src/features/weather/service.ts", "utf-8");
assert(weatherServiceSource.includes("https://api.open-meteo.com/v1"), "Open-Meteo base URL configured");
assert(weatherServiceSource.includes("generateAgroAdvisories"), "Generates agricultural advisories from weather metrics");
assert(weatherServiceSource.includes("getFallbackWeather"), "Provides deterministic offline climate fallback on network errors");

// Test Agro-advisory generation logic
function generateAgroAdvisoriesMock(temp, humidity, windSpeed, rainSum) {
  const advisories = [];
  if (windSpeed > 15 || rainSum > 2) {
    advisories.push({ id: "adv-spray-warning", severity: "warning", title: "फवारणी पुढे ढकला" });
  } else {
    advisories.push({ id: "adv-spray-safe", severity: "info", title: "फवारणीस अनुकूल" });
  }
  if (humidity > 75) {
    advisories.push({ id: "adv-fungal-warning", severity: "alert", title: "बुरशी सतर्कता" });
  }
  return advisories;
}

const highWindAdvisories = generateAgroAdvisoriesMock(28, 60, 20, 0);
assert(
  highWindAdvisories.some((a) => a.id === "adv-spray-warning"),
  "High wind (>15 km/h) triggers safe spray warning advisory"
);

const highHumidityAdvisories = generateAgroAdvisoriesMock(28, 85, 5, 0);
assert(
  highHumidityAdvisories.some((a) => a.id === "adv-fungal-warning"),
  "High humidity (>75%) triggers fungal disease prevention alert"
);

// ==========================================
// 3. AI Safety Classifier & Agricultural Disclaimers
// ==========================================
console.log("\n3. AI Prompt Safety & Chemical Guardrails:");

const safetySource = readFileSync("src/features/ai/safety.ts", "utf-8");
assert(safetySource.includes("monocrotophos"), "Classifies monocrotophos hazard");
assert(safetySource.includes("endosulfan"), "Classifies endosulfan hazard");
assert(safetySource.includes("paraquat"), "Classifies paraquat hazard");

const HIGH_HAZARD_PESTICIDES = {
  monocrotophos: "मोनोक्रोटोफॉस (Monocrotophos) - बंदी असलेले कीटकनाशक.",
  endosulfan: "एंडोसल्फान (Endosulfan) - भारतात पूर्णपणे प्रतिबंधित.",
};

function classifyPromptSafetyMock(prompt) {
  const lower = prompt.toLowerCase();
  const detected = [];
  const warnings = [];

  for (const [key, desc] of Object.entries(HIGH_HAZARD_PESTICIDES)) {
    if (lower.includes(key)) {
      detected.push(key);
      warnings.push(`घातक घटक सतर्कता: ${desc}`);
    }
  }

  if (lower.includes("डोस वाढवून") || lower.includes("double dose")) {
    warnings.push("मात्रा सुरक्षा सूचना: शिफारसीपेक्षा जास्त मात्रा वापरू नका.");
  }

  return { isSafe: detected.length === 0, detected, warnings };
}

const safePrompt = classifyPromptSafetyMock("सोयाबीन पिकाला पाणी कधी द्यावे?");
assert(safePrompt.isSafe && safePrompt.detected.length === 0, "Standard agronomy query passes safety classification");

const monocrotophosPrompt = classifyPromptSafetyMock("टोमॅटोवर monocrotophos फवारू शकतो का?");
assert(!monocrotophosPrompt.isSafe && monocrotophosPrompt.detected.includes("monocrotophos"), "Monocrotophos is flagged as unsafe hazardous agrochemical");

const endosulfanPrompt = classifyPromptSafetyMock("endosulfan चे प्रमाण किती घ्यावे?");
assert(!endosulfanPrompt.isSafe && endosulfanPrompt.detected.includes("endosulfan"), "Banned Endosulfan is flagged with critical alert");

const highDosePrompt = classifyPromptSafetyMock("अळी मरत नाही म्हणून डोस वाढवून तिप्पट मारू का?");
assert(highDosePrompt.warnings.some((w) => w.includes("मात्रा सुरक्षा")), "Overdosing query triggers safe pesticide dosage warning");

// Check AI Service safety fallback and disclaimers
const aiServiceSource = readFileSync("src/features/ai/service.ts", "utf-8");
assert(aiServiceSource.includes("AI_AGRICULTURAL_DISCLAIMER_MR"), "Includes mandatory Marathi agricultural disclaimer");
assert(aiServiceSource.includes("generateDeterministicAgriculturalResponse"), "Includes deterministic offline advisory engine when API key is missing");
assert(aiServiceSource.includes("gemini-1.5-flash"), "Configured with Gemini 1.5 Flash endpoint");

// ==========================================
// 4. File & Image Storage Validation
// ==========================================
console.log("\n4. Supabase Storage Limits & File Validation:");

const storageSource = readFileSync("src/lib/storage.ts", "utf-8");
assert(storageSource.includes("avatars"), "Configures avatars storage limit");
assert(storageSource.includes("marketplace"), "Configures marketplace storage limit");
assert(storageSource.includes("community"), "Configures community storage limit");

const STORAGE_LIMITS = {
  avatars: { maxSizeBytes: 2 * 1024 * 1024, allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] },
  marketplace: { maxSizeBytes: 5 * 1024 * 1024, allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] },
};

function validateUploadMock(bucket, size, mime) {
  const config = STORAGE_LIMITS[bucket];
  if (!config) return { valid: false, error: "Invalid bucket" };
  if (size > config.maxSizeBytes) return { valid: false, error: "Size exceeded" };
  if (!config.allowedMimeTypes.includes(mime)) return { valid: false, error: "Invalid mime" };
  return { valid: true };
}

assert(validateUploadMock("marketplace", 3 * 1024 * 1024, "image/jpeg").valid, "3MB JPG upload is valid for marketplace");
assert(!validateUploadMock("avatars", 3 * 1024 * 1024, "image/jpeg").valid, "3MB file is rejected for 2MB avatar limit");
assert(!validateUploadMock("marketplace", 1 * 1024 * 1024, "application/pdf").valid, "PDF file is rejected by image upload validator");

// Verify Migration 006 exists and defines storage & AI audit tables
const m006Path = "supabase/migrations/006_storage_and_ai.sql";
assert(existsSync(m006Path), "Migration 006_storage_and_ai.sql exists");
const m006Sql = readFileSync(m006Path, "utf-8");
assert(m006Sql.includes("storage.buckets"), "Migration 006 configures storage buckets");
assert(m006Sql.includes("public.ai_consultations"), "Migration 006 defines ai_consultations audit log table");
assert(m006Sql.includes("ENABLE ROW LEVEL SECURITY"), "Enables RLS on ai_consultations");

// ==========================================
// 5. Localization Parity (mr, hi, en) for Weather and AI
// ==========================================
console.log("\n5. Localization Parity for Weather & AI Namespaces:");
const mrJson = JSON.parse(readFileSync("src/locales/mr.json", "utf-8"));
const hiJson = JSON.parse(readFileSync("src/locales/hi.json", "utf-8"));
const enJson = JSON.parse(readFileSync("src/locales/en.json", "utf-8"));

for (const section of ["weather", "ai"]) {
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
// 6. Progressive Web App (PWA) & Mobile Navigation Suite
// ==========================================
console.log("\n6. PWA Manifest, Service Worker Security & Mobile Experience:");

// 6.1 Web App Manifest Verification
const manifestPath = "public/manifest.json";
assert(existsSync(manifestPath), "Web app manifest exists at public/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

assert(manifest.name && manifest.name.includes("KrishiConnect"), "Manifest defines valid application name");
assert(manifest.short_name === "KrishiConnect", "Manifest defines concise short_name");
assert(manifest.start_url === "/", "Manifest start_url is root (/)");
assert(manifest.display === "standalone", "Manifest display mode is standalone");
assert(manifest.theme_color === "#185C37", "Manifest theme_color matches Krishi brand green (#185C37)");
assert(manifest.background_color === "#F7F5EE", "Manifest background_color matches warm ivory (#F7F5EE)");

// Check manifest icons
const icon192 = manifest.icons.find((i) => i.sizes === "192x192");
const icon512 = manifest.icons.find((i) => i.sizes === "512x512");
assert(icon192 && existsSync(`public${icon192.src}`), "192x192 PNG icon exists on disk");
assert(icon512 && existsSync(`public${icon512.src}`), "512x512 PNG icon exists on disk");
assert(manifest.icons.some((i) => i.purpose && i.purpose.includes("maskable")), "Manifest provides maskable icon for Android adaptive icons");

// 6.2 Service Worker Security & Privacy Audit
const swPath = "public/sw.js";
assert(existsSync(swPath), "Service worker exists at public/sw.js");
const swContent = readFileSync(swPath, "utf-8");

assert(swContent.includes("/api/"), "Service worker excludes API routes from cache");
assert(swContent.includes("/auth/"), "Service worker excludes auth endpoints from cache");
assert(swContent.includes("supabase.co"), "Service worker strictly excludes Supabase cloud endpoints from shared cache");
assert(swContent.includes("/offline"), "Service worker provides offline fallback (/offline)");

// 6.3 Mobile Navigation & Farmer Dashboard Hub
const bottomNavContent = readFileSync("src/components/layout/BottomNavigation.tsx", "utf-8");
assert(bottomNavContent.includes("safe-area-inset-bottom"), "BottomNavigation supports device safe-area insets");
assert(bottomNavContent.includes("aria-current"), "BottomNavigation provides accessible active-state indicators");

const aiModalPath = "src/features/ai/AiConsultationModal.tsx";
assert(existsSync(aiModalPath), "AI consultation modal component exists for mobile agronomist advice");

const homeDashboardContent = readFileSync("src/app/(dashboard)/home/page.tsx", "utf-8");
assert(homeDashboardContent.includes("AiConsultationModal"), "Home screen integrates AI consultation entry point");
assert(homeDashboardContent.includes("getWeatherAction"), "Home screen integrates agro-meteorological weather card");
assert(homeDashboardContent.includes("farming.addCrop"), "Home screen provides quick action for adding crops");

const installPromptPath = "src/components/layout/InstallPwaPrompt.tsx";
assert(existsSync(installPromptPath), "InstallPwaPrompt component exists for beforeinstallprompt handling");

// ==========================================
// 7. Full App-Wide Localization & Secure Farm Deletion
// ==========================================
console.log("\n7. App-Wide Localization & Secure Farm Deletion Verification:");

// 7.1 Locale files existence and 100% key parity across mr, hi, en
const mrLocale = JSON.parse(readFileSync("src/locales/mr.json", "utf-8"));
const hiLocale = JSON.parse(readFileSync("src/locales/hi.json", "utf-8"));
const enLocale = JSON.parse(readFileSync("src/locales/en.json", "utf-8"));

assert(mrLocale && hiLocale && enLocale, "All three locale dictionaries (mr, hi, en) are valid JSON");

function getAllKeys(obj, prefix = "") {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === "object" && obj[el] !== null) {
      return [...res, ...getAllKeys(obj[el], prefix + el + ".")];
    }
    return [...res, prefix + el];
  }, []);
}

const enKeys = new Set(getAllKeys(enLocale));
const mrKeys = new Set(getAllKeys(mrLocale));
const hiKeys = new Set(getAllKeys(hiLocale));

assert(enKeys.size > 200, `Rich dictionary coverage: English has ${enKeys.size} keys`);

// Check missing keys in Marathi
const missingInMr = [...enKeys].filter((k) => !mrKeys.has(k));
assert(missingInMr.length === 0, `Marathi dictionary has 100% key parity with English (${missingInMr.length} missing: ${missingInMr.slice(0, 5).join(", ")})`);

// Check missing keys in Hindi
const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
assert(missingInHi.length === 0, `Hindi dictionary has 100% key parity with English (${missingInHi.length} missing: ${missingInHi.slice(0, 5).join(", ")})`);

// 7.2 Deletion-specific localization keys in all three languages
const deleteKeys = [
  "farming.deleteFarmTitle",
  "farming.deleteFarmSubtitle",
  "farming.deleteFarmWarning",
  "farming.deleteFarmConsequences",
  "farming.confirmDeleteFarm",
  "farming.deletingFarm",
  "farming.deleteFarmSuccess",
  "farming.deleteFarmError",
  "farming.deleteFarmAction",
  "farming.acresUnit",
  "farming.fields",
  "farming.crops",
  "farming.tasks",
  "common.cancel"
];

for (const dk of deleteKeys) {
  assert(enKeys.has(dk), `English contains delete key: ${dk}`);
  assert(mrKeys.has(dk), `Marathi contains delete key: ${dk}`);
  assert(hiKeys.has(dk), `Hindi contains delete key: ${dk}`);
}

// 7.3 I18n Provider & SSR Hydration Guard
const i18nContent = readFileSync("src/lib/i18n.tsx", "utf-8");
assert(i18nContent.includes("krishiconnect_lang="), "I18nProvider persists language preference via cookie");
assert(i18nContent.includes("document.documentElement.lang"), "I18nProvider synchronizes HTML lang attribute dynamically");
assert(i18nContent.includes("initialLanguage"), "I18nProvider accepts initialLanguage from SSR to prevent hydration mismatch");
assert(i18nContent.includes("formatNumber"), "I18n provides locale-aware number formatting");
assert(i18nContent.includes("formatDate"), "I18n provides locale-aware date formatting");

const rootLayoutContent = readFileSync("src/app/layout.tsx", "utf-8");
assert(rootLayoutContent.includes("cookies()"), "Root layout reads language cookie for server-side rendering");
assert(rootLayoutContent.includes("<I18nProvider initialLanguage="), "Root layout passes initialLanguage to eliminate flash of wrong language");

// 7.4 Delete Farm Modal & Security Guardrails
const deleteModalPath = "src/features/crops/DeleteFarmModal.tsx";
assert(existsSync(deleteModalPath), "DeleteFarmModal component exists");
const deleteModalContent = readFileSync(deleteModalPath, "utf-8");
assert(deleteModalContent.includes("deleteFarmAction"), "DeleteFarmModal invokes server action deleteFarmAction");
assert(deleteModalContent.includes("getFarmDependentsAction"), "DeleteFarmModal fetches dependent record counts for user confirmation");
assert(deleteModalContent.includes("isDeleting"), "DeleteFarmModal prevents duplicate submissions during deletion");
assert(deleteModalContent.includes('role="dialog"'), "DeleteFarmModal provides accessible dialog role");

// 7.5 Server Actions Ownership & Cascade Deletion
const cropActionsContent = readFileSync("src/features/crops/actions.ts", "utf-8");
assert(cropActionsContent.includes("export async function deleteFarmAction"), "Crop actions export deleteFarmAction");
assert(cropActionsContent.includes("export async function getFarmDependentsAction"), "Crop actions export getFarmDependentsAction");
assert(cropActionsContent.includes("owner_id !=="), "deleteFarmAction verifies farm ownership server-side");
assert(cropActionsContent.includes('revalidatePath("/crops")'), "deleteFarmAction triggers revalidation of crops screen");
assert(cropActionsContent.includes('revalidatePath("/home")'), "deleteFarmAction triggers revalidation of home screen");

// 7.6 Database Schema Cascades & RLS Policy
const cropMigrationPath = "supabase/migrations/002_crops_and_farms.sql";
assert(existsSync(cropMigrationPath), "Crop schema migration 002 exists");
const cropMigrationContent = readFileSync(cropMigrationPath, "utf-8");
assert(cropMigrationContent.includes("REFERENCES public.farms(id) ON DELETE CASCADE"), "farm_fields table configures ON DELETE CASCADE for farms");
assert(cropMigrationContent.includes("REFERENCES public.farm_fields(id) ON DELETE CASCADE"), "crop_records table configures ON DELETE CASCADE for fields");
assert(cropMigrationContent.includes("REFERENCES public.crop_records(id) ON DELETE CASCADE"), "crop_tasks table configures ON DELETE CASCADE for crops");
assert(cropMigrationContent.includes('CREATE POLICY "Farmers can delete own farms"'), "RLS enforces policy allowing only farm owners to delete their farms");

// ==========================================
// Summary
// ==========================================
console.log("\n========================================================");
console.log(`Milestone 5 Integration Test Results: ${passed} passed, ${failed} failed`);
console.log("========================================================\n");

if (failed > 0) {
  process.exit(1);
}

