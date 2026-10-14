"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/features/auth/actions";
import { getExpertRepository } from "./repository";
import {
  GetExpertsOptions,
  ConsultationStatusType,
} from "./types";
import {
  createConsultationRequestSchema,
  updateConsultationStatusSchema,
  CreateConsultationRequestInput,
  UpdateConsultationStatusInput,
} from "./schemas";

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const DEMO_FARMER = {
  id: "00000000-0000-0000-0000-000000000020",
  full_name: "रमेश पाटील (Ramesh Patil)",
};

async function resolveUserContext(): Promise<{ id: string; full_name: string; isAdmin: boolean }> {
  const userContext = await getCurrentUserProfile();
  if (userContext?.profile) {
    const profile = userContext.profile as any;
    const roles = userContext.roles.map((r: any) => r.role);
    return {
      id: profile.id,
      full_name: profile.full_name,
      isAdmin: roles.includes("admin"),
    };
  }
  return {
    id: DEMO_FARMER.id,
    full_name: DEMO_FARMER.full_name,
    isAdmin: false,
  };
}

export async function getExpertsAction(options: GetExpertsOptions = {}): Promise<ActionResult> {
  try {
    const repo = getExpertRepository();
    const result = await repo.getExperts(options);
    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "तज्ज्ञ यादी आणण्यात त्रुटी आली",
    };
  }
}

export async function getExpertDetailAction(id: string): Promise<ActionResult> {
  try {
    const repo = getExpertRepository();
    const expert = await repo.getExpertById(id);
    if (!expert) {
      return {
        success: false,
        error: "कृषी तज्ज्ञ प्रोफाइल सापडले नाही",
      };
    }
    return {
      success: true,
      data: expert,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "तज्ज्ञ माहिती आणण्यात त्रुटी आली",
    };
  }
}

export async function createConsultationRequestAction(input: CreateConsultationRequestInput): Promise<ActionResult> {
  try {
    const validation = createConsultationRequestSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध माहिती",
      };
    }

    const user = await resolveUserContext();
    const repo = getExpertRepository();
    const req = await repo.createConsultationRequest(validation.data, user.id, user.full_name);

    revalidatePath("/experts");
    return {
      success: true,
      data: req,
      message: "सल्ला विनंती यशस्वीरित्या नोंदवली गेली! तज्ज्ञ लवकरच संपर्क साधतील.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "सल्ला विनंती पाठवण्यात त्रुटी आली",
    };
  }
}

export async function getMyConsultationsAction(): Promise<ActionResult> {
  try {
    const user = await resolveUserContext();
    const repo = getExpertRepository();
    const requests = await repo.getConsultations({ farmerId: user.id });
    return {
      success: true,
      data: requests,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "सल्ला विनंत्या आणण्यात त्रुटी आली",
    };
  }
}

export async function updateConsultationStatusAction(input: UpdateConsultationStatusInput): Promise<ActionResult> {
  try {
    const validation = updateConsultationStatusSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध माहिती",
      };
    }

    const user = await resolveUserContext();
    const repo = getExpertRepository();
    const updated = await repo.updateConsultationStatus(
      validation.data.requestId,
      validation.data.status,
      validation.data.expertNotes,
      user.id,
      user.isAdmin
    );

    revalidatePath("/experts");
    return {
      success: true,
      data: updated,
      message: "सल्ला विनंती स्थिती अद्ययावत झाली",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "स्थिती बदलण्यात त्रुटी आली",
    };
  }
}
