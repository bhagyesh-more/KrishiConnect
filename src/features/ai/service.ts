import { classifyAgriculturalPromptSafety } from "./safety";

export interface AiConsultationRequest {
  prompt: string;
  cropContext?: string;
  district?: string;
  language?: "mr" | "hi" | "en";
}

export interface AiConsultationResponse {
  answer: string;
  safetyWarnings: string[];
  hasHarmfulSubstanceFlag: boolean;
  isMockResponse: boolean;
  modelUsed: string;
  disclaimer: string;
}

export const AI_AGRICULTURAL_DISCLAIMER_MR =
  "महत्त्वाची सूचना: कृषीकनेक्ट AI सहाय्यकाचा सल्ला केवळ प्राथमिक माहिती व मार्गदर्शनासाठी आहे. हा सल्ला अधिकृत कृषी विज्ञान केंद्र (KVK) किंवा विद्यापीठाच्या थेट शास्त्रज्ञांच्या सल्ल्याचा पर्याय नाही. कोणत्याही रासायनिक कीटकनाशकाचा वापर करण्यापूर्वी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या आणि लेबलवरील सूचनांचे काटेकोर पालन करा.";

export const AI_AGRICULTURAL_DISCLAIMER_EN =
  "Important Notice: KrishiConnect AI recommendations are indicative guidance only and do not replace certified agronomist or KVK consultation. Always verify pesticide dosage and label instructions before application.";

export async function askAgriculturalAssistant(
  input: AiConsultationRequest
): Promise<AiConsultationResponse> {
  const { prompt, cropContext, district, language = "mr" } = input;

  // 1. Mandatory Safety Pre-screening
  const safetyCheck = classifyAgriculturalPromptSafety(prompt);

  // 2. Server-side API Key check (NEVER client side)
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyMissingOrPlaceholder =
    !apiKey ||
    apiKey.includes("AIzaSy...") ||
    apiKey.startsWith("your-") ||
    apiKey.length < 10;

  if (isKeyMissingOrPlaceholder) {
    // Graceful, helpful mock response based on prompt and safety checks
    return generateDeterministicAgriculturalResponse(
      prompt,
      cropContext,
      district,
      language,
      safetyCheck.safetyWarnings,
      safetyCheck.harmfulSubstancesDetected.length > 0
    );
  }

  // 3. Live Google Gemini API Integration (Server-side Edge/Node fetch)
  try {
    const systemPrompt = `You are KrishiConnect Agri-Assistant, an empathetic agricultural expert specializing in Maharashtra crops (soybean, cotton, sugarcane, onion, pomegranate, grapes).
- Output language: Marathi by default (or user selected language).
- Emphasize Integrated Pest Management (IPM), soil testing, balanced NPK, and safe pesticide handling.
- NEVER recommend banned Indian pesticides (such as monocrotophos on vegetables, endosulfan, phorate).
- Include standard precautions for farmer health and safety.`;

    const userContent = `Farmer Location: ${district || "Maharashtra"}
Crop: ${cropContext || "Not specified"}
Farmer Question: ${prompt}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\n${userContent}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for high factual grounding
          maxOutputTokens: 1000,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Gemini API error code: ${res.status}`);
    }

    const data = await res.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "माहिती उपलब्ध नाही. कृपया थोड्या वेळाने प्रयत्न करा.";

    return {
      answer: generatedText,
      safetyWarnings: safetyCheck.safetyWarnings,
      hasHarmfulSubstanceFlag: safetyCheck.harmfulSubstancesDetected.length > 0,
      isMockResponse: false,
      modelUsed: "gemini-1.5-flash",
      disclaimer:
        language === "en" ? AI_AGRICULTURAL_DISCLAIMER_EN : AI_AGRICULTURAL_DISCLAIMER_MR,
    };
  } catch (err: any) {
    // Graceful fallback to deterministic advisory engine on network/key error
    return generateDeterministicAgriculturalResponse(
      prompt,
      cropContext,
      district,
      language,
      [
        ...safetyCheck.safetyWarnings,
        `थेट AI सेवा तात्पुरती अनुपलब्ध असल्यामुळे सुरक्षित ऑफलाइन सल्ला दाखवत आहे (${err.message || "Network Error"}).`,
      ],
      safetyCheck.harmfulSubstancesDetected.length > 0
    );
  }
}

function generateDeterministicAgriculturalResponse(
  prompt: string,
  crop: string | undefined,
  district: string | undefined,
  language: string,
  warnings: string[],
  hasHarmfulFlag: boolean
): AiConsultationResponse {
  const p = prompt.toLowerCase();
  let answer = "";

  if (p.includes("कीड") || p.includes("अळी") || p.includes("रोग") || p.includes("pest")) {
    answer = `**पिकावरील कीड व रोग नियंत्रण एकात्मिक सल्ला (IPM Advisory):**
1. **प्राथमिक पाहणी (Scouting):** शेतात ५ ठिकाणी 'W' किंवा 'Z' आकारात फिरून प्रादुर्भावाची पातळी तपासा.
2. **जैविक उपाय:** सुरुवातीच्या टप्प्यात निंबोळी अर्क ५% (५० मिली/१० लि. पाणी) फवारावा किंवा कामगंध सापळे (Pheromone Traps) एकरी ५ लावा.
3. **रासायनिक फवारणी:** प्रादुर्भाव आर्थिक नुकसानीच्या पातळीवर (ETL) गेल्यासच विद्यापीठ शिफारशीनुसार कीटकनाशकाची योग्य मात्रा वापरावी.
4. **खबरदारी:** फवारणी करताना संरक्षक मास्क व हातमोजे वापरा आणि वाऱ्याच्या दिशेने फवारणी करा.`;
  } else if (p.includes("खत") || p.includes("fertilizer") || p.includes("डोस")) {
    answer = `**संतुलित खत व्यवस्थापन मार्गदर्शक:**
1. **माती परीक्षण:** खतांचा अतिरिक्त खर्च टाळण्यासाठी जमिनीचे माती परीक्षण करूनच नत्र, स्फुरद, पालाश द्या.
2. **सेंद्रिय खते:** पेरणीपूर्वी चांगले कुजलेले शेणखत किंवा गांडूळ खत जमिनीत मिसळा.
3. **सूक्ष्म अन्नद्रव्ये:** झिंक व फेरसची कमतरता असल्यास ग्रेड-२ मायक्रोन्युट्रिएंट्स फवारणी करावी.
4. **खत देण्याची पद्धत:** युरिया उघड्यावर न टाकता मातीत मिसळून द्यावा किंवा ठिबकद्वारे द्यावा.`;
  } else if (p.includes("पाणी") || p.includes("सिंचन") || p.includes("water") || p.includes("irrigation")) {
    answer = `**पाणी व सिंचन व्यवस्थापन सल्ला:**
1. **ठिबक सिंचन:** पाटाच्या पाण्याऐवजी ठिबकचा वापर केल्यास ५०% पाण्याची बचत होते आणि उत्पादनात वाढ होते.
2. **पाण्याचा ताण:** पीक फुलोऱ्यात असताना आणि दाणे भरताना पाण्याचा ताण पडू देऊ नये.
3. **वाफसा:** जमिनीत कायम वाफसा (ओलावा व हवा यांचे ५०-५०% प्रमाण) राहील याची काळजी घ्या.`;
  } else {
    answer = `**कृषीकनेक्ट कृषी सल्ला:**
आपल्या ${crop || "पिकाच्या"} समस्येसाठी स्थानिक हवामान (${district || "महाराष्ट्र"}) लक्षात घेऊन पुढील प्रमाणे काळजी घ्यावी:
1. पिकाचे नियमित निरीक्षण ठेवा.
2. तज्ज्ञांच्या सल्ल्याशिवाय दोनपेक्षा जास्त रासायनिक औषधे एकत्र मिसळू नका.
3. अधिक अचूक मार्गदर्शनासाठी आपल्या जवळील कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा.`;
  }

  return {
    answer,
    safetyWarnings: warnings,
    hasHarmfulSubstanceFlag: hasHarmfulFlag,
    isMockResponse: true,
    modelUsed: "offline-agro-expert-engine",
    disclaimer:
      language === "en" ? AI_AGRICULTURAL_DISCLAIMER_EN : AI_AGRICULTURAL_DISCLAIMER_MR,
  };
}
