import {
  GovernmentScheme,
  GetSchemesOptions,
  EligibilityAssessmentInput,
  EligibilityAssessmentResult,
} from "./types";
import { SchemesRepository } from "./repository";

export const MOCK_SCHEMES: GovernmentScheme[] = [
  {
    id: "00000000-0000-0000-0000-000000000301",
    scheme_code: "MAHA-IRR-01",
    title_mr: "महाडीबीटी सूक्ष्म सिंचन योजना (ठिबक व तुषार सिंचन)",
    title_hi: "महाडीबीटी सूक्ष्म सिंचाई योजना (ड्रिप और स्प्रिंकलर)",
    title_en: "MahaDBT Micro Irrigation Scheme (Drip & Sprinkler Subsidy)",
    administering_body: "कृषी विभाग, महाराष्ट्र शासन (Dept of Agriculture, GoM)",
    category: "irrigation",
    summary_mr: "पाण्याची बचत आणि पिकांच्या उत्पादकतेत वाढ करण्यासाठी ठिबक व तुषार संचावर अल्प व अत्यल्प भूधारक शेतकऱ्यांना ८०% आणि इतर शेतकऱ्यांना ७५% शासकीय अनुदान.",
    summary_hi: "पानी की बचत और फसल पैदावार बढ़ाने के लिए ड्रिप और स्प्रिंकलर सिस्टम पर लघु और सीमांत किसानों को 80% तथा अन्य किसानों को 75% सरकारी सब्सिडी।",
    summary_en: "Up to 80% government subsidy for small/marginal farmers and 75% for other farmers on drip and sprinkler irrigation systems via MahaDBT portal.",
    beneficiary_type: "सर्व संवर्ग शेतकरी (अल्प, अत्यल्प व बहुभूधारक)",
    eligibility_criteria: [
      {
        rule: "land_ownership",
        label_mr: "शेतकऱ्याच्या स्वतःच्या किंवा कुटुंबाच्या नावावर ७/१२ व ८-अ उतारा असणे आवश्यक.",
        label_en: "Applicant must possess clear land title (7/12 & 8-A extract).",
      },
      {
        rule: "water_source",
        label_mr: "शेतात कायमस्वरूपी विहीर, बोअरवेल, शेततळे किंवा कालवा पाणीपुरवठ्याची सुविधा असणे आवश्यक.",
        label_en: "Must have assured water source (well, borewell, farm pond, or canal).",
        requires_irrigation: true,
      },
      {
        rule: "electric_connection",
        label_mr: "पंप संच किंवा सौर कृषी पंप अथवा वीज जोडणी आवश्यक.",
        label_en: "Must have working pump or electricity/solar connection.",
      },
    ],
    benefits_description_mr: "अल्प व अत्यल्प भूधारक (५ एकरांपर्यंत) शेतकऱ्यांना ८०% अनुदान; ५ एकरांपेक्षा जास्त जमीन असणाऱ्या शेतकऱ्यांना ७५% अनुदान. थेट बँक खात्यात DBT द्वारे जमा.",
    benefits_description_hi: "लघु व सीमांत किसानों (5 एकड़ तक) को 80% तथा अन्य किसानों को 75% अनुदान। डीबीटी के माध्यम से सीधे बैंक खाते में भुगतान।",
    benefits_description_en: "80% subsidy for small/marginal farmers (< 5 acres) and 75% for others, credited directly via DBT to Aadhaar-linked bank account.",
    documents_required: [
      "७/१२ (7/12) उतारा व ८-अ (8-A) नोंद",
      "आधार कार्ड (Aadhaar Card)",
      "बँक पासबुक झेरॉक्स (Bank Passbook)",
      "जातीचे प्रमाणपत्र (लागू असल्यास)",
      "जलस्रोत दाखला व वीज बिल किंवा सौर पंप पावती",
    ],
    application_steps: [
      "महाडीबीटी (mahadbt.maharashtra.gov.in) पोर्टलवर शेतकरी नोंदणी करा.",
      "'सिंचन साधने व सुविधा' या घटकांतर्गत ठिबक/तुषार सिंचन पर्याय निवडा.",
      "कागदपत्रे अपलोड करून अर्ज शुल्क भरून नोंदणी पूर्ण करा.",
      "लॉटरी सोडतीनंतर पूर्वसंमती (Pre-Sanction) पत्र मिळताच अधिकृत विक्रेत्याकडून संच खरेदी करा.",
      "मोका तपासणी (Field Geo-tagging) नंतर थेट खात्यावर अनुदान जमा होते.",
    ],
    official_portal_url: "https://mahadbt.maharashtra.gov.in",
    last_verified_date: "2026-03-15",
    application_deadline: null, // Year-round open window
    is_demo_record: false,
    created_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000302",
    scheme_code: "PMFBY-MAHA",
    title_mr: "पंतप्रधान पीक विमा योजना (केवळ ₹ १ शेतकरी हिस्सा योजना)",
    title_hi: "प्रधानमंत्री फसल बीमा योजना (मात्र ₹ 1 किसान अंशदान)",
    title_en: "Pradhan Mantri Fasal Bima Yojana (PMFBY ₹1 State Contribution Scheme)",
    administering_body: "महाराष्ट्र शासन व कृषी मंत्रालय भारत सरकार",
    category: "insurance",
    summary_mr: "नैसर्गिक आपत्ती, अवकाळी पाऊस, दुष्काळ व कीडरोगांमुळे होणाऱ्या पिकांच्या नुकसानीविरुद्ध शेतकऱ्यांना केवळ ₹ १ भरून सर्वसमावेशक पीक विमा संरक्षण. उर्वरित विमा हप्ता शासन भरते.",
    summary_hi: "प्राकृतिक आपदा, बेमौसम बारिश, सूखा और कीट प्रकोप से होने वाले फसल नुकसान के विरुद्ध मात्र ₹1 में व्यापक बीमा सुरक्षा। शेष प्रीमियम शासन भरता है।",
    summary_en: "Comprehensive crop insurance for adverse weather, drought, unseasonal rain, and pests at a nominal farmer premium of just ₹1 (remainder subsidized by GoM).",
    beneficiary_type: "अधिसूचित क्षेत्रातील अधिसूचित पिके घेणारे सर्व शेतकरी (कर्जदार व बिगर-कर्जदार)",
    eligibility_criteria: [
      {
        rule: "crop_sowing",
        label_mr: "ई-पीक पाहणी किंवा तलाठी नोंदीनुसार अधिसूचित पिकाची अधिकृत पेरणी नोंद असणे आवश्यक.",
        label_en: "Registered crop sowing on E-Peek Pahani or Talathi record.",
      },
      {
        rule: "bank_account",
        label_mr: "आधार संलग्न राष्ट्रीयकृत किंवा सहकारी बँक खाते असणे आवश्यक.",
        label_en: "Aadhaar-linked active bank account.",
      },
    ],
    benefits_description_mr: "हवामान आधारित अथवा पीक कापणी प्रयोगानुसार पिकांचे नुकसान झाल्यास थेट भरपाई. स्थानिक नैसर्गिक आपत्तीत (पूर, गारपीट) ७२ तासांत सूचना दिल्यास वैयक्तिक पंचनामा करून भरपाई.",
    benefits_description_hi: "मौसम आधारित अथवा कटाई प्रयोग के आधार पर नुकसान भरपाई। स्थानीय आपदा (ओलावृष्टि, बाढ़) में 72 घंटे में सूचना पर व्यक्तिगत क्षतिपूर्ति।",
    benefits_description_en: "Financial payout based on weather index and crop-cutting experiments, with localized post-harvest disaster coverage upon 72-hour intimation.",
    documents_required: [
      "चालू हंगामाचा ई-पीक पाहणी नोंद असलेला ७/१२ उतारा",
      "आधार कार्ड",
      "बँक पासबुक प्रत",
      "पीक पेरणी स्वयंघोषणापत्र",
    ],
    application_steps: [
      "pmfby.gov.in किंवा जवळच्या सीएससी (CSC) केंद्रावर जा.",
      "आधार क्रमांक व बँक खात्याची पडताळणी करा.",
      "हंगाम, जिल्हा, तालुका व सर्व्हे नंबर टाकून पिकाची निवड करा.",
      "केवळ ₹ १ विमा शुल्क ऑनलाइन भरून पावती डाउनलोड करा.",
    ],
    official_portal_url: "https://pmfby.gov.in",
    last_verified_date: "2026-04-01",
    application_deadline: "2026-07-31",
    is_demo_record: false,
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000303",
    scheme_code: "PM-KISAN",
    title_mr: "पंतप्रधान किसान सन्मान निधी (PM-KISAN)",
    title_hi: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
    title_en: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    administering_body: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
    category: "subsidy",
    summary_mr: "शेतकरी कुटुंबांना खते, बियाणे व कृषी गरजा भागवण्यासाठी दर चार महिन्यांनी ₹ २,००० याप्रमाणे वर्षाला एकूण ₹ ६,००० ची थेट बँक खात्यात आर्थिक मदत.",
    summary_hi: "किसान परिवारों को कृषि आदान और वित्तीय जरूरतों के लिए प्रति चार माह ₹ 2,000 के अनुसार कुल ₹ 6,000 वार्षिक प्रत्यक्ष बैंक अंतरण।",
    summary_en: "Annual income support of ₹6,000 in three four-monthly installments of ₹2,000 directly transferred to eligible landholder farmer families.",
    beneficiary_type: "जमीन धारक शेतकरी कुटुंबे",
    eligibility_criteria: [
      {
        rule: "landholder",
        label_mr: "स्वतःच्या नावावर शेतजमीन असलेला शेतकरी असावा.",
        label_en: "Must be a cultivable landholding farmer.",
      },
      {
        rule: "ekyc_mandatory",
        label_mr: "पोर्टलवर आधार e-KYC व भूमी अभिलेख (Land Seeding) पडताळणी पूर्ण असणे बंधनकारक.",
        label_en: "Aadhaar e-KYC and land seeding mandatory.",
      },
      {
        rule: "exclusions",
        label_mr: "संस्थात्मक जमीनदार, घटनात्मक पदधारक, सरकारी नोकरदार किंवा आयकर भरणारे अपात्र.",
        label_en: "Income-tax payers and institutional landholders excluded.",
      },
    ],
    benefits_description_mr: "वर्षाला तीन हप्त्यांमध्ये ₹ २,००० + ₹ २,००० + ₹ २,००० = ₹ ६,००० थेट बँक खात्यात जमा (DBT).",
    benefits_description_hi: "प्रति वर्ष तीन किश्तों में कुल ₹ 6,000 बैंक खाते में सीधा अंतरण।",
    benefits_description_en: "Direct financial benefit of ₹6,000 per year paid in three installments directly to Aadhaar-seeded accounts.",
    documents_required: [
      "आधार कार्ड",
      "७/१२ उतारा (जमीन नोंदी)",
      "आधार संलग्न बँक खाते तपशील",
    ],
    application_steps: [
      "pmkisan.gov.in वर 'New Farmer Registration' पर्यायावर क्लिक करा.",
      "आधार क्रमांक आणि राज्य निवडून फॉर्म भरा.",
      "जमिनीचा सर्व्हे नंबर, गट नंबर व बँक तपशील भरा.",
      "ओटीपी द्वारे आधार e-KYC पूर्ण करा.",
    ],
    official_portal_url: "https://pmkisan.gov.in",
    last_verified_date: "2026-03-20",
    application_deadline: null,
    is_demo_record: false,
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000304",
    scheme_code: "NAMO-MAHA",
    title_mr: "नमो शेतकरी महासन्मान निधी योजना (महाराष्ट्र शासन)",
    title_hi: "नमो शेतकरी महासम्मान निधि योजना (महाराष्ट्र शासन)",
    title_en: "Namo Shetkari Mahasanman Nidhi Scheme (GoM)",
    administering_body: "कृषी विभाग, महाराष्ट्र शासन",
    category: "subsidy",
    summary_mr: "केंद्र शासनाच्या PM-KISAN योजनेच्या ₹ ६,००० च्या जोडीला महाराष्ट्र शासनातर्फे अतिरिक्त ₹ ६,००० वार्षिक अनुदान. राज्यातील शेतकऱ्यांना वर्षाला एकूण ₹ १२,००० लाभ.",
    summary_hi: "केंद्र सरकार की PM-KISAN के ₹ 6,000 के अतिरिक्त महाराष्ट्र सरकार द्वारा ₹ 6,000 का अतिरिक्त अनुदान। कुल ₹ 12,000 प्रति वर्ष।",
    summary_en: "Maharashtra government's top-up scheme providing an additional ₹6,000/year to all state beneficiaries of PM-KISAN, totaling ₹12,000/year.",
    beneficiary_type: "महाराष्ट्रातील सर्व PM-KISAN पात्र शेतकरी",
    eligibility_criteria: [
      {
        rule: "pmkisan_approved",
        label_mr: "केंद्र सरकारच्या PM-KISAN योजनेत नाव मंजूर आणि सक्रिय असणे आवश्यक.",
        label_en: "Must be an active, approved beneficiary of PM-KISAN.",
      },
      {
        rule: "maharashtra_resident",
        label_mr: "शेतकरी महाराष्ट्र राज्याचा रहिवासी असावा व जमीन महाराष्ट्रात असावी.",
        label_en: "Must be a Maharashtra resident with land within Maharashtra.",
      },
    ],
    benefits_description_mr: "महाराष्ट्र शासनाकडून तीन हप्त्यांमध्ये अतिरिक्त ₹ ६,००० वार्षिक थेट खात्यावर जमा.",
    benefits_description_hi: "महाराष्ट्र शासन द्वारा तीन किश्तों में अतिरिक्त ₹ 6,000 वार्षिक डीबीटी अंतरण।",
    benefits_description_en: "Additional ₹6,000 per annum paid in three equal installments of ₹2,000 via DBT by Government of Maharashtra.",
    documents_required: [
      "PM-KISAN नोंदणीकृत शेतकरी क्रमांक (Registration Number)",
      "आधार कार्ड",
      "डीबीटी सक्रिय बँक पासबुक",
    ],
    application_steps: [
      "PM-KISAN लाभार्थी असलेल्या शेतकऱ्यांना वेगळा अर्ज करण्याची गरज नसते; डेटा स्वयंचलित जोडला जातो.",
      "महाडीबीटी पोर्टलवर आपल्या आधार आणि लँड सीडिंगची स्थिती तपासा.",
    ],
    official_portal_url: "https://mahadbt.maharashtra.gov.in",
    last_verified_date: "2026-03-25",
    application_deadline: null,
    is_demo_record: false,
    created_at: "2026-01-18T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000305",
    scheme_code: "DBAKSY-MAHA",
    title_mr: "डॉ. बाबासाहेब आंबेडकर कृषी स्वावलंबन योजना",
    title_hi: "डॉ. बाबासाहेब आंबेडकर कृषि स्वावलंबन योजना",
    title_en: "Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana",
    administering_body: "सामाजिक न्याय व कृषी विभाग, महाराष्ट्र शासन",
    category: "irrigation",
    summary_mr: "अनुसूचित जाती व नवबौद्ध प्रवर्गातील शेतकऱ्यांचे जीवनमान उंचावण्यासाठी नवीन विहीर (₹ २.५ लाख), जुनी विहीर दुरुस्ती, शेततळे प्लास्टिक व पंप संचासाठी १००% शासकीय अनुदान.",
    summary_hi: "अनुसूचित जाति व नवबौद्ध किसानों के उत्थान के लिए नए कुएं (₹ 2.5 लाख), जीर्णोद्धार, खेत तालाब और पंप सेट पर 100% तक अनुदान।",
    summary_en: "Special component scheme for SC farmers providing up to ₹2,50,000 for new irrigation wells, in-well boring, pump sets, and farm pond lining.",
    beneficiary_type: "अनुसूचित जाती (SC) प्रवर्गातील शेतकरी",
    eligibility_criteria: [
      {
        rule: "caste_sc",
        label_mr: "शेतकरी अनुसूचित जाती (SC) किंवा नवबौद्ध प्रवर्गातील असणे आवश्यक (सक्षम प्राधिकाऱ्याचे जात प्रमाणपत्र).",
        label_en: "Applicant must belong to Scheduled Caste (SC) category.",
        eligible_categories: ["sc_st"],
      },
      {
        rule: "land_size",
        label_mr: "किमान ०.४० हेक्टर (१ एकर) व कमाल ६ हेक्टर शेतजमीन असावी.",
        label_en: "Landholding between 0.40 hectare (1 acre) and 6 hectares.",
        min_acres: 1,
        max_acres: 15,
      },
      {
        rule: "income_limit",
        label_mr: "शेतकऱ्याचे वार्षिक उत्पन्न कमाल ₹ १,५०,००० च्या आत असावे.",
        label_en: "Annual family income up to ₹1,50,000.",
      },
    ],
    benefits_description_mr: "नवीन विहिरीसाठी कमाल ₹ २,५०,०००; जुनी विहीर दुरुस्तीसाठी ₹ ५०,०००; इनवेल बोअरिंगसाठी ₹ २०,०००; पंप संच व शेततळे अस्तरीकरणासाठी १००% अनुदान.",
    benefits_description_hi: "नवीन कुएं हेतु ₹ 2.5 लाख, मरम्मत हेतु ₹ 50 हजार तथा सौर/विद्युत पंप और खेत तालाब लाइनिंग पर भारी सब्सिडी।",
    benefits_description_en: "Up to ₹2,50,000 for new wells, ₹50,000 for repairs, and 100% assistance for electric pumps and farm-pond plastic lining.",
    documents_required: [
      "सक्षम प्राधिकार्‍याचे अनुसूचित जातीचे प्रमाणपत्र (Caste Certificate)",
      "तहसीलदार यांचे वार्षिक उत्पन्नाचे प्रमाणपत्र",
      "७/१२, ८-अ उतारा व चतुःसीमा दाखला",
      "विहीर नसल्याचे भूजल सर्वेक्षण प्रमाणपत्र",
      "आधार कार्ड व बँक पासबुक",
    ],
    application_steps: [
      "महाडीबीटी पोर्टलवर लॉगिन करा.",
      "'विशेष घटक योजना (SC)' निवडून 'डॉ. बाबासाहेब आंबेडकर कृषी स्वावलंबन योजना' निवडा.",
      "जात प्रमाणपत्र, उत्पन्न प्रमाणपत्र व भूजल दाखला अपलोड करा.",
      "मंजुरी मिळाल्यानंतर टप्प्याटप्प्याने विहीर खोदकाम करून जिओ-टॅग फोटो अपलोड करा.",
    ],
    official_portal_url: "https://mahadbt.maharashtra.gov.in",
    last_verified_date: "2026-03-10",
    application_deadline: null,
    is_demo_record: false,
    created_at: "2026-01-20T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000306",
    scheme_code: "SHETTALE-MAHA",
    title_mr: "मागेल त्याला शेततळे योजना (जलयुक्त शिवार २.०)",
    title_hi: "मागेल त्याला शेततळे योजना (जलयुक्त शिवार)",
    title_en: "Magel Tyala Shet-tale (Farm Pond on Demand)",
    administering_body: "मृद व जलसंधारण विभाग, महाराष्ट्र शासन",
    category: "irrigation",
    summary_mr: "पावसाचे वाहून जाणारे पाणी शेतातच साठवून संरक्षित ओलिताची सोय करण्यासाठी शेतात इन-सीटू शेततळे खोदकामासाठी कमाल ₹ ७५,००० पर्यंत थेट शासकीय अनुदान.",
    summary_hi: "वर्षा जल संचयन और संरक्षित सिंचाई के लिए खेत तालाब निर्माण पर ₹ 75,000 तक प्रत्यक्ष सरकारी सहायता।",
    summary_en: "Farm pond on demand initiative providing direct assistance up to ₹75,000 for digging rainwater harvesting farm ponds.",
    beneficiary_type: "सर्व शेतकरी (किमान ०.६० हेक्टर जमीन आवश्यक)",
    eligibility_criteria: [
      {
        rule: "land_size",
        label_mr: "शेतकऱ्याकडे किमान ०.६० हेक्टर (दीड एकर) सलग शेतजमीन असावी.",
        label_en: "Minimum 0.60 hectare continuous landholding.",
        min_acres: 1.5,
      },
      {
        rule: "technical_suitability",
        label_mr: "जमिनीची रचना पावसाचे पाणी साचण्यास योग्य असावी.",
        label_en: "Technically viable slope and soil strata.",
      },
    ],
    benefits_description_mr: "शेततळ्याच्या आकारमानानुसार (३०x३०x३ मीटर) थेट ₹ ७५,००० पर्यंत अनुदान. प्लास्टिक अस्तरीकरणासाठी अतिरिक्त ५०% अनुदान.",
    benefits_description_hi: "आकार के अनुसार ₹ 75,000 तक का अनुदान तथा प्लास्टिक लाइनिंग के लिए अतिरिक्त सहायता।",
    benefits_description_en: "Financial assistance up to ₹75,000 based on standard farm pond dimensions (30x30x3m).",
    documents_required: [
      "७/१२ व ८-अ उतारा",
      "सहमती पत्र (इतर सहहिस्सेदार असल्यास)",
      "आधार कार्ड व बँक पासबुक",
    ],
    application_steps: [
      "महाडीबीटीवर 'मागेल त्याला शेततळे' घटकांतर्गत अर्ज भरा.",
      "कृषी सहाय्यकाकडून जागेची प्राथमिक पाहणी व स्थळ निश्चिती.",
      "खोदकाम पूर्ण झाल्यावर जिओ-टॅगिंग व मोजणी.",
      "थेट बँक खात्यात अनुदान जमा.",
    ],
    official_portal_url: "https://mahadbt.maharashtra.gov.in",
    last_verified_date: "2026-03-12",
    application_deadline: null,
    is_demo_record: false,
    created_at: "2026-01-22T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000307",
    scheme_code: "PDKV-ORGANIC",
    title_mr: "डॉ. पंजाबराव देशमुख जैविक शेती मिशन (सेंद्रिय शेती प्रोत्साहन)",
    title_hi: "डॉ. पंजाबराव देशमुख जैविक कृषि मिशन",
    title_en: "Dr. Panjabrao Deshmukh Organic Farming Mission",
    administering_body: "कृषी विभाग, महाराष्ट्र शासन",
    category: "organic",
    summary_mr: "विषमुक्त, रसायनमुक्त सेंद्रिय शेतीला चालना देण्यासाठी शेतकरी उत्पादक गट (FPO), गांडूळ खत, सेंद्रिय प्रमाणीकरण (PGS-India) व थेट विक्री बाजारासाठी अर्थसहाय्य.",
    summary_hi: "जैविक व रसायनमुक्त खेती को बढ़ावा देने हेतु किसान उत्पादक समूहों (FPO), वर्मीकम्पोस्ट, प्रमाणीकरण और जैविक विपणन सहायता।",
    summary_en: "Promotion of organic farming clusters, PGS-India certification, vermicompost units, and organic brand marketing across Maharashtra.",
    beneficiary_type: "सेंद्रिय शेती करणारे शेतकरी व शेतकरी गट (FPOs)",
    eligibility_criteria: [
      {
        rule: "group_formation",
        label_mr: "किमान २० शेतकऱ्यांचा सेंद्रिय शेती गट किंवा शेतकरी उत्पादक कंपनी (FPO) असणे आवश्यक.",
        label_en: "Must be part of an organic farming group (min 20 farmers) or FPO.",
      },
      {
        rule: "no_chemical_commitment",
        label_mr: "सलग ३ वर्षे रासायनिक खते व कीटकनाशके न वापरण्याचे हमीपत्र.",
        label_en: "Commitment to chemical-free farming for minimum 3 years.",
      },
    ],
    benefits_description_mr: "प्रति गट सेंद्रिय निविष्ठा, गांडूळ खत युनिट, बायो-डायजेस्टर व प्रमाणीकरणासाठी ३ वर्षांत ₹ ५ ते १० लाख पर्यंत क्लस्टर अनुदान.",
    benefits_description_hi: "प्रति समूह वर्मीकम्पोस्ट, बायो-फर्टिलाइजर और प्रमाणीकरण हेतु 3 वर्षों में अनुदान।",
    benefits_description_en: "Cluster-based financial assistance up to ₹5-10 lakhs over 3 years for certification, input preparation, and organic outlets.",
    documents_required: [
      "गटातील सर्व शेतकऱ्यांचे ७/१२",
      "गट नोंदणी ठराव व अध्यक्ष/सचिव तपशील",
      "सेंद्रिय शेती प्रशिक्षण प्रमाणपत्र (लागू असल्यास)",
    ],
    application_steps: [
      "तालुका कृषी अधिकारी (TAO) यांच्याकडे गट नोंदणी प्रस्ताव सादर करा.",
      "कृषी विद्यापीठाकडून प्राथमिक माती व जैविक तपासणी.",
      "क्लस्टर मंजुरीनंतर डीबीटी अनुदान वितरण.",
    ],
    official_portal_url: "https://krishi.maharashtra.gov.in",
    last_verified_date: "2026-02-28",
    application_deadline: null,
    is_demo_record: false,
    created_at: "2026-01-25T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000308",
    scheme_code: "SMAM-TRACTOR",
    title_mr: "कृषी यांत्रिकीकरण उप-अभियान (ट्रॅक्टर व कृषी अवजारे अनुदान)",
    title_hi: "कृषि यंत्रीकरण उप-मिशन (ट्रैक्टर व कृषि उपकरण)",
    title_en: "Sub-Mission on Agricultural Mechanization (SMAM Equipment)",
    administering_body: "कृषी विभाग, महाराष्ट्र शासन व केंद्र शासन",
    category: "equipment",
    summary_mr: "शेतमजुरांची टंचाई दूर करण्यासाठी व शेतीकामांचा वेग वाढवण्यासाठी ट्रॅक्टर, पॉवर टिलर, रोटाव्हेटर, रिपर, मळणी यंत्र खरेदीवर ४०% ते ५०% शासकीय अनुदान.",
    summary_hi: "खेती कार्यों में सुगमता हेतु ट्रैक्टर, पावर टिलर, रोटावेटर और थ्रेशर खरीद पर 40% से 50% तक सरकारी सब्सिडी।",
    summary_en: "40% to 50% capital subsidy on purchase of agricultural tractors, power tillers, rotavators, multi-crop threshers, and laser land levelers.",
    beneficiary_type: "सर्व संवर्ग शेतकरी (महिला व अनुसूचित जाती/जमातींना प्राधान्य)",
    eligibility_criteria: [
      {
        rule: "land_ownership",
        label_mr: "स्वतःच्या नावावर शेतजमीन (७/१२) असणे आवश्यक.",
        label_en: "Cultivable land in applicant's name.",
      },
      {
        rule: "prior_benefit",
        label_mr: "मागील १० वर्षांत याच यंत्रासाठी शासकीय अनुदानाचा लाभ घेतलेला नसावा.",
        label_en: "No duplicate subsidy on same implement within last 10 years.",
      },
    ],
    benefits_description_mr: "ट्रॅक्टरसाठी कमाल ₹ १,२५,००० पर्यंत अनुदान; अवजारांसाठी (रोटाव्हेटर, पेरणी यंत्र) ४०% ते ५०% अनुदान (कमाल ₹ ५०,००० ते ₹ १,००,०००).",
    benefits_description_hi: "ट्रैक्टर हेतु ₹ 1.25 लाख तक और कृषि यंत्रों पर 40% से 50% तक अनुदान।",
    benefits_description_en: "Subsidy up to ₹1,25,000 for tractors; 40-50% on implements credited after field verification and tax-invoice submission.",
    documents_required: [
      "७/१२ व ८-अ उतारा",
      "आधार कार्ड व बँक पासबुक",
      "अधिकृत विक्रेत्याचे कोटेशन (Quotation)",
      "अनुसूचित जाती/जमाती प्रमाणपत्र (लागू असल्यास)",
    ],
    application_steps: [
      "महाडीबीटी पोर्टलवर 'कृषी यांत्रिकीकरण' घटकांतर्गत यंत्राची निवड करा.",
      "ऑनलाइन लॉटरी सोडतीमध्ये निवड झाल्यानंतर पूर्वसंमती (Pre-sanction) पत्र मिळवा.",
      "अधिकृत डीलरकडून यंत्र खरेदी करून मूळ बिल व जीएसटी इन्व्हॉइस अपलोड करा.",
      "कृषी अधिकाऱ्यांद्वारे यंत्राची भौतिक पडताळणी (GPS फोटो) झाल्यावर अनुदान खात्यात जमा.",
    ],
    official_portal_url: "https://mahadbt.maharashtra.gov.in",
    last_verified_date: "2026-03-18",
    application_deadline: null,
    is_demo_record: false,
    created_at: "2026-01-28T00:00:00Z",
  },
];

class MockSchemesRepositoryImpl implements SchemesRepository {
  private schemes: GovernmentScheme[] = [...MOCK_SCHEMES];
  private savedSchemes: Set<string> = new Set(); // Stores "userId:schemeId"

  async getSchemes(options: GetSchemesOptions = {}): Promise<{ schemes: GovernmentScheme[]; total: number }> {
    let result = [...this.schemes];

    if (options.category && options.category !== "all") {
      result = result.filter((s) => s.category === options.category);
    }

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title_mr.toLowerCase().includes(q) ||
          s.title_hi.toLowerCase().includes(q) ||
          s.title_en.toLowerCase().includes(q) ||
          s.summary_mr.toLowerCase().includes(q) ||
          s.summary_en.toLowerCase().includes(q) ||
          s.scheme_code.toLowerCase().includes(q) ||
          s.administering_body.toLowerCase().includes(q)
      );
    }

    if (options.userId) {
      result = result.map((s) => ({
        ...s,
        is_saved: this.savedSchemes.has(`${options.userId}:${s.id}`),
      }));

      if (options.onlySaved) {
        result = result.filter((s) => s.is_saved);
      }
    }

    return {
      schemes: result,
      total: result.length,
    };
  }

  async getSchemeById(id: string, userId?: string): Promise<GovernmentScheme | null> {
    const scheme = this.schemes.find((s) => s.id === id);
    if (!scheme) return null;

    return {
      ...scheme,
      is_saved: userId ? this.savedSchemes.has(`${userId}:${scheme.id}`) : false,
    };
  }

  async toggleSaveScheme(schemeId: string, userId: string): Promise<{ saved: boolean }> {
    const key = `${userId}:${schemeId}`;
    if (this.savedSchemes.has(key)) {
      this.savedSchemes.delete(key);
      return { saved: false };
    } else {
      this.savedSchemes.add(key);
      return { saved: true };
    }
  }

  async checkEligibility(
    schemeId: string,
    input: EligibilityAssessmentInput
  ): Promise<EligibilityAssessmentResult> {
    const scheme = this.schemes.find((s) => s.id === schemeId);
    if (!scheme) {
      throw new Error("योजना सापडली नाही (Scheme not found)");
    }

    const matchedCriteria: string[] = [];
    const unmatchedCriteria: string[] = [];

    // General Land criteria check
    for (const crit of scheme.eligibility_criteria) {
      if (crit.min_acres !== undefined && input.landSizeAcres < crit.min_acres) {
        unmatchedCriteria.push(`किमान जमीन धारणा अट: ${crit.min_acres} एकर आवश्यक (आपली जमीन: ${input.landSizeAcres} एकर)`);
      } else if (crit.max_acres !== undefined && input.landSizeAcres > crit.max_acres) {
        unmatchedCriteria.push(`कमाल जमीन मर्यादा: ${crit.max_acres} एकरपर्यंत मर्यादा (आपली जमीन: ${input.landSizeAcres} एकर)`);
      } else if (crit.eligible_categories && crit.eligible_categories.length > 0) {
        if (!crit.eligible_categories.includes(input.farmerCategory)) {
          unmatchedCriteria.push(`संवर्ग अट: ही योजना केवळ ${crit.eligible_categories.join(", ")} साठी लागू आहे`);
        } else {
          matchedCriteria.push(crit.label_mr);
        }
      } else if (crit.requires_irrigation) {
        if (!input.hasIrrigation) {
          unmatchedCriteria.push("कायमस्वरूपी जलस्रोत / सिंचन व्यवस्था असणे आवश्यक आहे");
        } else {
          matchedCriteria.push(crit.label_mr);
        }
      } else {
        matchedCriteria.push(crit.label_mr);
      }
    }

    const totalCount = matchedCriteria.length + unmatchedCriteria.length;
    const scorePercentage = totalCount > 0 ? Math.round((matchedCriteria.length / totalCount) * 100) : 100;
    const isLikelyEligible = unmatchedCriteria.length === 0;

    const notes = isLikelyEligible
      ? "आपण प्राथमिक माहितीनुसार या योजनेसाठी संभाव्य पात्र आहात. अधिकृत अर्जासाठी आवश्यक कागदपत्रे व महाडीबीटी पोर्टलवर पडताळणी करा."
      : "आपण काही अटींची पूर्तता करत नसल्याचे दिसते. कृपया योजनेचा तपशील आणि अटी तपासा.";

    return {
      schemeId,
      isLikelyEligible,
      scorePercentage,
      matchedCriteria,
      unmatchedCriteria,
      notes,
    };
  }
}

export const mockSchemesRepository = new MockSchemesRepositoryImpl();
