"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/features/auth/actions";
import { getSchemesRepository } from "./repository";
import {
  GetSchemesOptions,
  EligibilityAssessmentInput,
} from "./types";
import { assessmentInputSchema } from "./schemas";

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000020";

async function resolveUserId(): Promise<string> {
  const userContext = await getCurrentUserProfile();
  if (userContext?.user?.id) {
    return userContext.user.id;
  }
  return DEMO_USER_ID;
}

export async function getSchemesAction(options: GetSchemesOptions = {}): Promise<ActionResult> {
  try {
    const userId = await resolveUserId();
    const repo = getSchemesRepository();
    const result = await repo.getSchemes({ ...options, userId });
    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "योजना आणण्यात त्रुटी आली",
    };
  }
}

export async function getSchemeDetailAction(id: string): Promise<ActionResult> {
  try {
    const userId = await resolveUserId();
    const repo = getSchemesRepository();
    const scheme = await repo.getSchemeById(id, userId);
    if (!scheme) {
      return {
        success: false,
        error: "योजना सापडली नाही",
      };
    }
    return {
      success: true,
      data: scheme,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "योजना आणण्यात त्रुटी आली",
    };
  }
}

export async function toggleSaveSchemeAction(schemeId: string): Promise<ActionResult> {
  try {
    const userId = await resolveUserId();
    const repo = getSchemesRepository();
    const result = await repo.toggleSaveScheme(schemeId, userId);

    revalidatePath("/schemes");
    revalidatePath(`/schemes/${schemeId}`);
    return {
      success: true,
      data: result,
      message: result.saved ? "योजना बुकमार्क केली!" : "योजना बुकमार्क काढून टाकली",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "बुकमार्क करण्यात त्रुटी आली",
    };
  }
}

export async function checkSchemeEligibilityAction(
  schemeId: string,
  input: EligibilityAssessmentInput
): Promise<ActionResult> {
  try {
    const validation = assessmentInputSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध माहिती",
      };
    }

    const repo = getSchemesRepository();
    const assessment = await repo.checkEligibility(schemeId, validation.data);

    return {
      success: true,
      data: assessment,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "पात्रता तपासण्यात त्रुटी आली",
    };
  }
}
