"use server";

import { createClient } from "@/lib/supabase/server";
import {
  farmSchema,
  fieldSchema,
  cropRecordSchema,
  cropTaskSchema,
  FarmInput,
  FieldInput,
  CropRecordInput,
  CropTaskInput,
} from "./schemas";
import { DEFAULT_CROP_GUIDES } from "./agronomy";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ==============================================================================
// 1. Farms Actions
// ==============================================================================

export async function getFarmsAction(): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा (Please log in first)" };
  }

  const { data, error } = await supabase
    .from("farms")
    .select("*, farm_fields(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data || [] };
}

export async function createFarmAction(input: FarmInput): Promise<ActionResult> {
  const validation = farmSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || "अवैध शेत माहिती" };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा (Please log in)" };
  }

  const { farmName, totalAreaAcres, irrigationSource, soilType, locationDistrict, locationTaluka } = validation.data;

  const { data, error } = await (supabase.from("farms") as any)
    .insert({
      owner_id: user.id,
      farm_name: farmName,
      total_area_acres: totalAreaAcres,
      irrigation_source: irrigationSource,
      soil_type: soilType || null,
      location_district: locationDistrict,
      location_taluka: locationTaluka || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/crops");
  revalidatePath("/home");
  return { success: true, message: "शेत यशस्वीरित्या नोंदवले गेले!", data };
}

// ==============================================================================
// 2. Fields Actions
// ==============================================================================

export async function createFieldAction(input: FieldInput): Promise<ActionResult> {
  const validation = fieldSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || "अवैध तुकडा माहिती" };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  const { farmId, fieldName, areaAcres, soilType, irrigationType } = validation.data;

  const { data, error } = await (supabase.from("farm_fields") as any)
    .insert({
      farm_id: farmId,
      field_name: fieldName,
      area_acres: areaAcres,
      soil_type: soilType || null,
      irrigation_type: irrigationType || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/crops");
  revalidatePath("/home");
  return { success: true, message: "शेताचा तुकडा यशस्वीरित्या जोडला गेला!", data };
}

// ==============================================================================
// 3. Crop Guides & Records Actions
// ==============================================================================

export async function getCropGuidesAction(): Promise<ActionResult> {
  const supabase = createClient();
  const { data, error } = await (supabase.from("crop_guides") as any)
    .select("*")
    .order("crop_name_mr", { ascending: true });

  if (error || !data || data.length === 0) {
    // Graceful fallback to reviewed baseline crop guides
    return { success: true, data: DEFAULT_CROP_GUIDES };
  }

  return { success: true, data };
}

export async function getCropRecordsAction(fieldId?: string): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  let query = (supabase.from("crop_records") as any)
    .select("*, crop_guides(*), farm_fields(*, farms(*)), crop_tasks(*)")
    .order("created_at", { ascending: false });

  if (fieldId) {
    query = query.eq("field_id", fieldId);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data || [] };
}

export async function createCropRecordAction(input: CropRecordInput): Promise<ActionResult> {
  const validation = cropRecordSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || "अवैध पीक नोंद माहिती" };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  const {
    fieldId,
    guideId,
    customCropName,
    variety,
    season,
    sowingDate,
    expectedHarvestDate,
    status,
    notes,
  } = validation.data;

  const { data: record, error } = await (supabase.from("crop_records") as any)
    .insert({
      field_id: fieldId,
      guide_id: guideId && guideId.length > 0 ? guideId : null,
      custom_crop_name: customCropName || null,
      variety: variety || null,
      season,
      sowing_date: sowingDate,
      expected_harvest_date: expectedHarvestDate && expectedHarvestDate.length > 0 ? expectedHarvestDate : null,
      status,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Auto-generate initial agronomy tasks if guided crop
  if (guideId && record) {
    const guide = DEFAULT_CROP_GUIDES.find((g) => g.id === guideId);
    if (guide && guide.growth_stages) {
      const sowing = new Date(sowingDate);
      const initialTasks = guide.growth_stages.flatMap((stage) =>
        stage.tasks.map((taskTitle) => {
          const taskDate = new Date(sowing);
          taskDate.setDate(taskDate.getDate() + Math.max(1, stage.days - 5));
          const dueStr = taskDate.toISOString().split("T")[0];

          let category: "irrigation" | "fertilizer" | "pesticide" | "weeding" | "harvest" | "scouting" = "scouting";
          if (taskTitle.includes("पाणी") || taskTitle.includes("सिंचन")) category = "irrigation";
          else if (taskTitle.includes("खत") || taskTitle.includes("युरिया") || taskTitle.includes("सल्फर")) category = "fertilizer";
          else if (taskTitle.includes("कीड") || taskTitle.includes("अळी") || taskTitle.includes("फवारणी")) category = "pesticide";
          else if (taskTitle.includes("तण")) category = "weeding";
          else if (taskTitle.includes("काढणी") || taskTitle.includes("तोडणी")) category = "harvest";

          return {
            crop_record_id: (record as any).id,
            title: taskTitle,
            description: `${stage.nameMr} अंतर्गत शिफारस केलेले कार्य.`,
            category,
            due_date: dueStr,
            priority: "medium" as const,
          };
        })
      );

      if (initialTasks.length > 0) {
        await (supabase.from("crop_tasks") as any).insert(initialTasks);
      }
    }
  }

  revalidatePath("/crops");
  revalidatePath("/home");
  return { success: true, message: "पीक नोंद यशस्वीरित्या तयार झाली!", data: record };
}

export async function updateCropStatusAction(
  cropRecordId: string,
  status: "planned" | "sown" | "growing" | "harvesting" | "completed" | "abandoned",
  actualHarvestDate?: string
): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  const payload: any = { status };
  if (actualHarvestDate) {
    payload.actual_harvest_date = actualHarvestDate;
  }

  const { error } = await (supabase.from("crop_records") as any)
    .update(payload)
    .eq("id", cropRecordId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/crops");
  revalidatePath("/home");
  return { success: true, message: "पिकाची स्थिती अद्ययावत केली!" };
}

// ==============================================================================
// 4. Crop Tasks Actions
// ==============================================================================

export async function getCropTasksAction(cropRecordId?: string): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  let query = supabase
    .from("crop_tasks")
    .select("*, crop_records(*, farm_fields(*, farms(*)))")
    .order("due_date", { ascending: true });

  if (cropRecordId) {
    query = query.eq("crop_record_id", cropRecordId);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data || [] };
}

export async function createCropTaskAction(input: CropTaskInput): Promise<ActionResult> {
  const validation = cropTaskSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || "अवैध कार्य माहिती" };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  const { cropRecordId, title, description, category, dueDate, priority } = validation.data;

  const { data, error } = await (supabase.from("crop_tasks") as any)
    .insert({
      crop_record_id: cropRecordId,
      title,
      description: description || null,
      category,
      due_date: dueDate,
      priority,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/crops");
  revalidatePath("/home");
  return { success: true, message: "कार्य यशस्वीरित्या जोडले गेले!", data };
}

export async function toggleCropTaskAction(taskId: string, isCompleted: boolean): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "कृपया प्रथम लॉगिन करा" };
  }

  const { error } = await (supabase.from("crop_tasks") as any)
    .update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq("id", taskId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/crops");
  revalidatePath("/home");
  return { success: true, message: isCompleted ? "कार्य पूर्ण म्हणून नोंदवले!" : "कार्य पुन्हा उघडले!" };
}

// ==============================================================================
// 5. Farmer Dashboard Aggregate Summary
// ==============================================================================

export async function getFarmerDashboardSummaryAction(): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: true,
      data: {
        isAnonymous: true,
        farmsCount: 0,
        activeCropsCount: 0,
        pendingTasksCount: 0,
        overdueTasksCount: 0,
        recentCrops: [],
        upcomingTasks: [],
      },
    };
  }

  // Fetch Farms
  const { data: farms } = await (supabase.from("farms") as any)
    .select("id");

  // Fetch Crop Records
  const { data: crops } = await (supabase.from("crop_records") as any)
    .select("*, crop_guides(*), farm_fields(*, farms(*))")
    .order("created_at", { ascending: false });

  // Fetch Tasks
  const { data: tasks } = await (supabase.from("crop_tasks") as any)
    .select("*, crop_records(custom_crop_name, variety, crop_guides(crop_name_mr))")
    .order("due_date", { ascending: true });

  const allCrops = (crops as any[]) || [];
  const allTasks = (tasks as any[]) || [];

  const activeCrops = allCrops.filter((c: any) => c.status !== "completed" && c.status !== "abandoned");

  const todayStr = new Date().toISOString().split("T")[0];
  const pendingTasks = allTasks.filter((t: any) => !t.is_completed);
  const overdueTasks = pendingTasks.filter((t: any) => t.due_date < todayStr);

  return {
    success: true,
    data: {
      isAnonymous: false,
      farmsCount: farms?.length || 0,
      activeCropsCount: activeCrops.length,
      pendingTasksCount: pendingTasks.length,
      overdueTasksCount: overdueTasks.length,
      recentCrops: allCrops.slice(0, 3),
      upcomingTasks: pendingTasks.slice(0, 5),
    },
  };
}
