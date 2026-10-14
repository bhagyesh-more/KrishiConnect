"use server";

import { askAgriculturalAssistant, AiConsultationRequest, AiConsultationResponse } from "./service";
import { createClient } from "@/lib/supabase/server";

export async function askAiAssistantAction(
  input: AiConsultationRequest
): Promise<AiConsultationResponse> {
  const result = await askAgriculturalAssistant(input);

  // Optional: Record audit log in database if Supabase is connected
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if live Supabase is configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
    ) {
      await (supabase.from("ai_consultations") as any).insert({
        user_id: user?.id || null,
        prompt_text: input.prompt,
        response_text: result.answer,
        crop_context: input.cropContext || null,
        district: input.district || null,
        language: input.language || "mr",
        safety_warnings_triggered: result.safetyWarnings,
        has_harmful_substance_flag: result.hasHarmfulSubstanceFlag,
        is_mock_response: result.isMockResponse,
      });
    }
  } catch {
    // Non-blocking for audit failure
  }

  return result;
}
