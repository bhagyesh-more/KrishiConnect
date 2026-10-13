// Agronomy calculations and Maharashtra crop guide knowledge base

export interface GrowthStage {
  stage: string;
  days: number;
  nameMr: string;
  tasks: string[];
}

export interface PestInfo {
  name: string;
  symptoms: string;
  preventive: string;
}

export interface CropGuideItem {
  id: string;
  crop_code: string;
  crop_name_mr: string;
  crop_name_hi: string;
  crop_name_en: string;
  variety: string;
  ideal_season: "Kharif" | "Rabi" | "Zaid" | "Perennial";
  growing_duration_days: number;
  soil_requirements: string;
  water_requirements: string;
  growth_stages: GrowthStage[];
  common_pests: PestInfo[];
  source_attribution: string;
}

// 5 Reviewed Maharashtra Baseline Crops (matches migration 002 seed data)
export const DEFAULT_CROP_GUIDES: CropGuideItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    crop_code: "SOYBEAN_JS335",
    crop_name_mr: "सोयाबीन",
    crop_name_hi: "सोयाबीन",
    crop_name_en: "Soybean",
    variety: "JS 335 / फुले कल्याणी",
    ideal_season: "Kharif",
    growing_duration_days: 100,
    soil_requirements: "मध्यम ते भारी, उत्तम निचरा होणारी काळी जमीन (सामू ६.५ ते ७.५)",
    water_requirements: "फुलोरा (३०-३५ दिवस) व शेंगा भरताना (५५-६५ दिवस) ओलावा आवश्यक. पाणी साचू नये.",
    growth_stages: [
      { stage: "Sowing & Emergence", days: 7, nameMr: "उगवण अवस्था", tasks: ["बीजप्रक्रिया (थायरम + रायझोबियम)", "ओल तपासून पेरणी"] },
      { stage: "Vegetative Growth", days: 30, nameMr: "शाकीय वाढ", tasks: ["तणनियंत्रण (२० दिवसांच्या आत)", "खोडमाशी निरीक्षण"] },
      { stage: "Flowering Stage", days: 55, nameMr: "फुलोरा अवस्था", tasks: ["सूक्ष्म अन्नद्रव्य फवारणी", "पाण्याचा ताण पडू न देणे"] },
      { stage: "Pod Development", days: 80, nameMr: "शेंगा भरणे", tasks: ["चक्रीभुंगा व अळी नियंत्रण", "संरक्षक पाणी"] },
      { stage: "Maturity & Harvest", days: 100, nameMr: "परिपक्वता व काढणी", tasks: ["पाने पिवळी पडून गळल्यावर काढणी", "योग्य वाळवण"] }
    ],
    common_pests: [
      { name: "खोडमाशी (Stem Fly)", symptoms: "रोपांची पाने कोमेजणे, खोडाला छिद्र", preventive: "पेरणीवेळी निंबोळी पेंड वापरणे व वेळेवर पेरणी" },
      { name: "चक्रीभुंगा (Girdle Beetle)", symptoms: "फांद्यांवर व देठावर गोलाकार खाचा", preventive: "प्रादुर्भावग्रस्त फांद्या नष्ट करणे" }
    ],
    source_attribution: "ICAR - भारतीय सोयाबीन संशोधन संस्था (IISR) आणि म.पु.कृ.वि. राहुरी"
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    crop_code: "COTTON_HYBRID",
    crop_name_mr: "कापूस",
    crop_name_hi: "कपास",
    crop_name_en: "Cotton",
    variety: "मध्यम-लांब धागा संकरित (BT/Non-BT)",
    ideal_season: "Kharif",
    growing_duration_days: 160,
    soil_requirements: "खोल काळी कसदार जमीन, पाण्याचा चांगला निचरा असणारी जमीन",
    water_requirements: "ठिबक सिंचन अत्यंत फायदेशीर; बोंड भरण्याच्या काळात नियमित हलके पाणी आवश्यक.",
    growth_stages: [
      { stage: "Germination & Early Growth", days: 15, nameMr: "उगवण व प्राथमिक वाढ", tasks: ["नांग्या भरणे", "रसशोषक किडींचे निरीक्षण"] },
      { stage: "Square Formation", days: 50, nameMr: "पाते धरणे", tasks: ["खतांचा पहिला हप्ता", "कामगंध सापळे लावणे (गुलाबी बोंडअळी)"] },
      { stage: "Flowering & Boll Setting", days: 100, nameMr: "फुल व बोंड धारणा", tasks: ["बोंडअळी नियमित गस्त", "डीएपी किंवा १९:१९:१९ फवारणी"] },
      { stage: "Boll Opening & Picking", days: 160, nameMr: "बोंड उमलणे व वेचणी", tasks: ["सुक्या हवेत स्वच्छ कापूस वेचणी", "कचरा विरहीत साठवणूक"] }
    ],
    common_pests: [
      { name: "गुलाबी बोंडअळी (Pink Bollworm)", symptoms: "पात्यांना छिद्र, डोमकळ्या", preventive: "हेक्टरी ५ कामगंध सापळे, जैविक ट्रायकोडर्मा/ट्रायकोग्रामा" },
      { name: "पांढरी माशी व मावा (Sucking Pests)", symptoms: "पाने आकसणे, चिकटा पडणे", preventive: "पिवळे चिकट सापळे व ५% निंबोळी अर्क फवारणी" }
    ],
    source_attribution: "केंद्रीय कापूस संशोधन संस्था (CICR) नागपूर व डॉ. पं.दे.कृ.वि. अकोला"
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    crop_code: "SUGARCANE_CO86032",
    crop_name_mr: "ऊस",
    crop_name_hi: "गन्ना",
    crop_name_en: "Sugarcane",
    variety: "को ८६०३२ (निरा) / फुले ०२६५",
    ideal_season: "Perennial",
    growing_duration_days: 360,
    soil_requirements: "मध्यम ते भारी, उत्तम निचऱ्याची गाळाची काळी जमीन (सामू ६.५ ते ८.०)",
    water_requirements: "मोठ्या प्रमाणावर पाणी आवश्यक; ठिबक सिंचनाने ४०-५०% पाण्याची बचत होते.",
    growth_stages: [
      { stage: "Germination & Sprouting", days: 35, nameMr: "उगवण अवस्था", tasks: ["बेणे प्रक्रिया (बुरशीनाशक + कीटकनाशक)", "तण नियंत्रण"] },
      { stage: "Tillering", days: 120, nameMr: "फुटव्यांची अवस्था", tasks: ["खतांचा दुसरा हप्ता", "खोडकीड नियंत्रण"] },
      { stage: "Grand Growth", days: 270, nameMr: "कांड्या सुटणे व वाढ", tasks: ["मोठी बांधणी (Earthing up)", "नियमित पाणी नियोजन"] },
      { stage: "Maturity & Ripening", days: 360, nameMr: "पक्वता व तोडणी", tasks: ["तोडणीपूर्वी १५ दिवस पाणी बंद करणे", "कारखान्याशी समन्वय"] }
    ],
    common_pests: [
      { name: "खोडकीड (Early Shoot Borer)", symptoms: "मध्यवर्ती पोंगा वाळणे", preventive: "मातीची हलकी भर देणे व फेरोमोन सापळे" },
      { name: "हुमणी (White Grub)", symptoms: "मुळे कुरतडल्याने ऊस वाळणे", preventive: "पावसाळ्याच्या सुरुवातीला भुंगेरे गोळा करून नष्ट करणे" }
    ],
    source_attribution: "वसंतदादा शुगर इन्स्टिट्यूट (VSI) पुणे व म.पु.कृ.वि. राहुरी"
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    crop_code: "ONION_RABI",
    crop_name_mr: "कांदा",
    crop_name_hi: "प्याज",
    crop_name_en: "Onion",
    variety: "बसंवत ७८० / फुले समर्थ / एन-२-४-१",
    ideal_season: "Rabi",
    growing_duration_days: 120,
    soil_requirements: "हलकी ते मध्यम पोयट्याची, सेंद्रिय खतांनी समृद्ध जमीन",
    water_requirements: "हलके व नियमित पाणी. काढणीपूर्वी १०-१२ दिवस पाणी बंद करावे.",
    growth_stages: [
      { stage: "Nursery Raising", days: 45, nameMr: "रोपवाटिका तयारी", tasks: ["गादीवाफे तयार करणे", "रोप संरक्षण फवारणी"] },
      { stage: "Transplanting", days: 65, nameMr: "पुनर्लागवड", tasks: ["रोपांचे शेंडे कापून लागवड", "तत्काळ हलके पाणी देणे"] },
      { stage: "Bulb Development", days: 95, nameMr: "कांदा पोसणे", tasks: ["सल्फर व पोटॅश मात्रा", "करपा व फुलकिडे नियंत्रण"] },
      { stage: "Harvesting & Curing", days: 120, nameMr: "काढणी व वाळवण", tasks: ["५०% माना पडल्यावर काढणी", "पानांसह शेतात वाळवणे"] }
    ],
    common_pests: [
      { name: "फुलकिडे (Thrips)", symptoms: "पानांवर पांढुरके चट्टे, पाने वाकडी होणे", preventive: "निळा चिकट सापळे व वेळेवर फवारणी" },
      { name: "जांभळा करपा (Purple Blotch)", symptoms: "पानांवर लांबट जांभळे डाग", preventive: "मॅन्कोझेब किंवा कॉपर ऑक्झिक्लोराईडची प्रतिबंधक फवारणी" }
    ],
    source_attribution: "ICAR - कांदा व लसूण संशोधन संचालनालय (DOGR) राजगुरुनगर, पुणे"
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    crop_code: "WHEAT_RABI",
    crop_name_mr: "गहू",
    crop_name_hi: "गेहूं",
    crop_name_en: "Wheat",
    variety: "एचडी २१८९ / फुले समाधान (NIAW-1994)",
    ideal_season: "Rabi",
    growing_duration_days: 115,
    soil_requirements: "मध्यम ते भारी, उत्तम निचऱ्याची काळी जमीन",
    water_requirements: "मुकुट मुळे फुटताना (२१ दिवस), कांडी धरताना (४०-४५ दिवस), व ओंबी भरताना पाणी देणे अनिवार्य.",
    growth_stages: [
      { stage: "Crown Root Initiation (CRI)", days: 25, nameMr: "मुकुट मुळे फुटणे (अतिसंवेदनशील)", tasks: ["पहिले महत्त्वाचे पाणी", "युरियाचा हप्ता"] },
      { stage: "Tillering & Jointing", days: 55, nameMr: "फुटवे व कांडी धरणे", tasks: ["तण नियंत्रण", "दुसरे पाणी नियोजन"] },
      { stage: "Heading & Flowering", days: 85, nameMr: "ओंब्या बाहेर पडणे व फुलोरा", tasks: ["तिसरे महत्त्वाचे पाणी", "तांबेरा रोग तपासणी"] },
      { stage: "Grain Filling & Maturity", days: 115, nameMr: "दाणे भरणे व परिपक्वता", tasks: ["हवेचा वेग पाहून हलके पाणी", "दाणे कडक झाल्यावर कापणी"] }
    ],
    common_pests: [
      { name: "तांबेरा (Rust)", symptoms: "पानांवर तपकिरी किंवा काळे डाग", preventive: "प्रतिकारक्षम वाणांची निवड व प्रोपिकोनेझोल फवारणी" },
      { name: "मावा (Aphids)", symptoms: "ओंब्यांवरून रस शोषणे", preventive: "पिवळे सापळे व मित्रकीटक संवर्धन" }
    ],
    source_attribution: "भारतीय गहू व बार्ली संशोधन संस्था (IIWBR) व म.पु.कृ.वि. राहुरी"
  }
];

export interface CropGrowthCalculation {
  elapsedDays: number;
  totalDays: number;
  progressPercent: number;
  currentStage: GrowthStage;
  nextStage?: GrowthStage;
  disclaimer: string;
}

export function calculateCropGrowth(
  sowingDateStr: string,
  guide?: CropGuideItem | null
): CropGrowthCalculation {
  const sowingDate = new Date(sowingDateStr);
  const today = new Date();
  const diffTime = today.getTime() - sowingDate.getTime();
  const elapsedDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const totalDays = guide?.growing_duration_days || 100;
  const progressPercent = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  const stages = guide?.growth_stages || DEFAULT_CROP_GUIDES[0].growth_stages;

  let currentStage = stages[0];
  let nextStage: GrowthStage | undefined = stages[1];

  for (let i = 0; i < stages.length; i++) {
    if (elapsedDays <= stages[i].days) {
      currentStage = stages[i];
      nextStage = stages[i + 1];
      break;
    }
    // If elapsedDays is beyond the last stage
    if (i === stages.length - 1) {
      currentStage = stages[i];
      nextStage = undefined;
    }
  }

  return {
    elapsedDays,
    totalDays,
    progressPercent,
    currentStage,
    nextStage,
    disclaimer:
      "टीप: ही गणना पेरणी तारखेवर आधारित अंदाजे प्रगती दर्शवते. स्थानिक हवामान, जमीन व वाणानुसार प्रत्यक्ष वाढ बदलू शकते.",
  };
}
