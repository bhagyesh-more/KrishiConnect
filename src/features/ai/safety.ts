export interface AiSafetyClassification {
  isSafe: boolean;
  harmfulSubstancesDetected: string[];
  safetyWarnings: string[];
}

// Banned or restricted agrochemicals in India / hazardous chemicals requiring immediate safety flag
export const HIGH_HAZARD_PESTICIDES: Record<string, string> = {
  monocrotophos: "मोनोक्रोटोफॉस (Monocrotophos) - अत्यंत विषारी व भाजीपाला/फळबागांवर बंदी असलेले कीटकनाशक.",
  phorate: "फोरेट (Phorate 10G) - तीव्र विषारी रासायनिक दाणेदार कीटकनाशक. मित्रकीटक व मानवी आरोग्यास घातक.",
  endosulfan: "एंडोसल्फान (Endosulfan) - सर्वोच्च न्यायालयाच्या आदेशानुसार भारतात पूर्णपणे प्रतिबंधित.",
  carbofuran: "कार्बोफ्युरॉन (Carbofuran) - उच्च विषारी श्रेणीतील कीटकनाशक.",
  paraquat: "पॅराक्वॉट (Paraquat Dichloride) - अत्यंत विषारी तणनाशक. प्रत्यक्ष त्वचेशी संपर्क घातक.",
  dichlorvos: "डायक्लोरोव्हॉस (DDVP / Dichlorvos) - घातक वाफेमुळे विषबाधेचा धोका असलेले कीटकनाशक.",
  methomyl: "मेथोमाइल (Methomyl) - प्रतिबंधित/अतिविषारी घटक.",
};

export function classifyAgriculturalPromptSafety(
  prompt: string
): AiSafetyClassification {
  const lowerPrompt = prompt.toLowerCase();
  const detectedSubstances: string[] = [];
  const warnings: string[] = [];

  for (const [key, description] of Object.entries(HIGH_HAZARD_PESTICIDES)) {
    if (lowerPrompt.includes(key)) {
      detectedSubstances.push(key);
      warnings.push(`घातक घटक सतर्कता: ${description}`);
    }
  }

  // Check if dangerous combinations (e.g., mixing multiple high-dose chemicals without safety equipment)
  if (
    lowerPrompt.includes("डोस वाढवून") ||
    lowerPrompt.includes("जास्त प्रमाणात") ||
    lowerPrompt.includes("double dose") ||
    lowerPrompt.includes("mix three pesticides")
  ) {
    warnings.push(
      "मात्रा सुरक्षा सूचना: कीटकनाशक किंवा विद्राव्य खतांची शिफारसीपेक्षा जास्त मात्रा वापरल्यास पिकांची पाने करपतात व जमिनीची सुपीकता नष्ट होते."
    );
  }

  return {
    isSafe: detectedSubstances.length === 0,
    harmfulSubstancesDetected: detectedSubstances,
    safetyWarnings: warnings,
  };
}
