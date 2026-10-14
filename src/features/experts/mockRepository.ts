import {
  ExpertProfile,
  ConsultationRequest,
  GetExpertsOptions,
  ConsultationStatusType,
} from "./types";
import {
  CreateConsultationRequestInput,
} from "./schemas";
import { ExpertRepository } from "./repository";

export const MOCK_EXPERTS: ExpertProfile[] = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    full_name: "डॉ. संजय देशमुख (Dr. Sanjay Deshmukh)",
    qualification: "एम.एस्सी. कृषी (कीटकशास्त्र), पीएच.डी.",
    specialization: "agronomy_pest",
    affiliation: "महात्मा फुले कृषी विद्यापीठ (MPKV), राहुरी",
    experience_years: 16,
    languages_spoken: ["मराठी", "हिंदी", "English"],
    supported_crops: ["सोयाबीन", "कापूस", "ऊस", "कांदा"],
    district: "अहमदनगर (Ahmednagar)",
    bio: "सोयाबीन खोडमाशी, कपाशीवरील गुलाबी बोंडअळी, आणि उसावरील हुमणी कीड एकात्मिक नियंत्रण (IPM) व्यवस्थापनातील १६ वर्षांचा प्रत्यक्ष संशोधन व शेतकरी सल्ला अनुभव.",
    is_available: true,
    is_verified: true,
    is_demo_profile: true,
    total_consultations_count: 142,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    full_name: "प्रा. सुरेश चव्हाण (Prof. Suresh Chavan)",
    qualification: "एम.एस्सी. (मृद व कृषी रसायनशास्त्र)",
    specialization: "soil_fertilizer",
    affiliation: "डॉ. पंजाबराव देशमुख कृषी विद्यापीठ (PDKV), अकोला",
    experience_years: 14,
    languages_spoken: ["मराठी", "हिंदी"],
    supported_crops: ["कापूस", "तूर", "सोयाबीन", "संत्रा"],
    district: "अकोला (Akola)",
    bio: "विदर्भातील काळ्या कसदार जमिनीत सूक्ष्म अन्नद्रव्य कमतरता निवारण, संतुलित खत मात्रा (RDF), आणि सेंद्रिय खतांच्या वापराद्वारे जमीन सुपीकता संवर्धन मार्गदर्शक.",
    is_available: true,
    is_verified: true,
    is_demo_profile: true,
    total_consultations_count: 98,
    created_at: "2026-01-05T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    full_name: "डॉ. अंजली कुलकर्णी (Dr. Anjali Kulkarni)",
    qualification: "पीएच.डी. (उद्यानविद्या - फळपिके)",
    specialization: "horticulture_fruits",
    affiliation: "वसंतराव नाईक मराठवाडा कृषी विद्यापीठ (VNMKV), परभणी",
    experience_years: 12,
    languages_spoken: ["मराठी", "English"],
    supported_crops: ["डाळिंब", "मोसंबी", "आंबा", "द्राक्षे"],
    district: "पुणे (Pune)",
    bio: "मराठवाडा व पश्चिम महाराष्ट्रात डाळिंब तेल्या रोग नियंत्रण, मोसंबी फळगळ समस्या, आणि उच्च घनता आंबा लागवड तंत्रज्ञानामध्ये विशेष प्राविण्य.",
    is_available: true,
    is_verified: true,
    is_demo_profile: true,
    total_consultations_count: 115,
    created_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    full_name: "इंजि. नीलेश शिंदे (Er. Nilesh Shinde)",
    qualification: "एम.टेक (सिंचन व निचरा अभियांत्रिकी)",
    specialization: "irrigation_engineering",
    affiliation: "कृषी विज्ञान केंद्र (KVK), बारामती",
    experience_years: 10,
    languages_spoken: ["मराठी", "हिंदी", "English"],
    supported_crops: ["ऊस", "भाजीपाला", "केळी", "द्राक्षे"],
    district: "पुणे (Pune)",
    bio: "ठिबक सिंचन संच रचना, ऑटोमेशन व्हॉल्व्ह, फर्टीगेशन शेड्युलिंग, आणि ऍसिड ट्रीटमेंटद्वारे क्षारयुक्त पाणी नियोजन तज्ज्ञ.",
    is_available: true,
    is_verified: true,
    is_demo_profile: true,
    total_consultations_count: 86,
    created_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    full_name: "बाळासाहेब पाटील (Balasaheb Patil)",
    qualification: "बी.एस्सी. कृषी, सेंद्रिय शेती मास्टर ट्रेनर",
    specialization: "organic_farming",
    affiliation: "सेंद्रिय शेतकरी संशोधन केंद्र, कोल्हापूर",
    experience_years: 18,
    languages_spoken: ["मराठी"],
    supported_crops: ["भाजीपाला", "हळद", "गूळ ऊस", "सोयाबीन"],
    district: "कोल्हापूर (Kolhapur)",
    bio: "जीवामृत, घनजीवामृत, दशपर्णी अर्क निर्मिती, देशी गायींवर आधारित नैसर्गिक शेती, आणि सेंद्रिय प्रमाणीकरण (PGS-India) मार्गदर्शन.",
    is_available: true,
    is_verified: true,
    is_demo_profile: true,
    total_consultations_count: 165,
    created_at: "2026-01-18T00:00:00Z",
  },
];

const INITIAL_REQUESTS: ConsultationRequest[] = [
  {
    id: "00000000-0000-0000-0000-000000000401",
    farmer_id: "00000000-0000-0000-0000-000000000020", // Ramesh Patil
    expert_id: MOCK_EXPERTS[0].id, // Dr. Sanjay Deshmukh
    crop_name: "सोयाबीन",
    subject: "सोयाबीन पानांवर पिवळे चट्टे व खोडमाशी प्रादुर्भाव",
    description: "सोयाबीन पीक ३५ दिवसांचे झाले असून झाडांची शेंडे वाळत आहेत. खोड उकलून पाहिले असता आत बारीक अळी दिसते आहे. योग्य फवारणी व उपाय सुचवावेत.",
    preferred_contact_method: "phone",
    preferred_time_slot: "दुपारी १२ ते २ दरम्यान",
    farmer_phone: "+91 98220 11223",
    farmer_name: "रमेश पाटील (नाशिक)",
    image_urls: [],
    status: "accepted",
    expert_notes: "प्राथमिक लक्षणांवरून खोडमाशी व चक्रीभुंग्याचा प्रादुर्भाव दिसतो. क्लोरएन्ट्रानिलीप्रोल (१८.५% एससी) ३ मिली प्रति १० लिटर पाणी फवारणी शिफारस.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    expert: MOCK_EXPERTS[0],
  },
  {
    id: "00000000-0000-0000-0000-000000000402",
    farmer_id: "00000000-0000-0000-0000-000000000020", // Ramesh Patil
    expert_id: MOCK_EXPERTS[3].id, // Er. Nilesh Shinde
    crop_name: "कांदा",
    subject: "ठिबक सिंचन डिस्चार्ज कमी झाला आहे, ऍसिड ट्रीटमेंट कशी करावी?",
    description: "विहिरीच्या पाण्यात क्षारांचे प्रमाण जास्त असल्याने ठिबकच्या ड्रिपर्समधून पाण्याचा प्रवाह कमी झाला आहे. हायड्रोक्लोरिक ऍसिड किती प्रमाणात सोडावे?",
    preferred_contact_method: "whatsapp",
    preferred_time_slot: "सकाळी ९ ते ११",
    farmer_phone: "+91 98220 11223",
    farmer_name: "रमेश पाटील (नाशिक)",
    image_urls: [],
    status: "pending",
    expert_notes: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    expert: MOCK_EXPERTS[3],
  },
];

class MockExpertRepositoryImpl implements ExpertRepository {
  private experts: ExpertProfile[] = [...MOCK_EXPERTS];
  private requests: ConsultationRequest[] = [...INITIAL_REQUESTS];

  async getExperts(options: GetExpertsOptions = {}): Promise<{ experts: ExpertProfile[]; total: number }> {
    let result = [...this.experts];

    if (options.specialization && options.specialization !== "all") {
      result = result.filter((e) => e.specialization === options.specialization);
    }

    if (options.district && options.district !== "all") {
      result = result.filter((e) => e.district.toLowerCase().includes(options.district!.toLowerCase()));
    }

    if (options.crop && options.crop.trim().length > 0) {
      const c = options.crop.trim().toLowerCase();
      result = result.filter((e) => e.supported_crops.some((crop) => crop.toLowerCase().includes(c)));
    }

    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.qualification.toLowerCase().includes(q) ||
          e.affiliation.toLowerCase().includes(q) ||
          e.district.toLowerCase().includes(q) ||
          (e.bio && e.bio.toLowerCase().includes(q))
      );
    }

    if (options.onlyAvailable) {
      result = result.filter((e) => e.is_available);
    }

    return {
      experts: result,
      total: result.length,
    };
  }

  async getExpertById(id: string): Promise<ExpertProfile | null> {
    const expert = this.experts.find((e) => e.id === id);
    return expert || null;
  }

  async createConsultationRequest(
    input: CreateConsultationRequestInput,
    farmerId: string,
    farmerName = "शेतकरी"
  ): Promise<ConsultationRequest> {
    const expert = input.expertId ? this.experts.find((e) => e.id === input.expertId) : null;

    const newRequest: ConsultationRequest = {
      id: crypto.randomUUID(),
      farmer_id: farmerId,
      expert_id: input.expertId || null,
      crop_name: input.cropName || null,
      subject: input.subject,
      description: input.description,
      preferred_contact_method: input.preferredContactMethod || "phone",
      preferred_time_slot: input.preferredTimeSlot || null,
      farmer_phone: input.farmerPhone || null,
      farmer_name: farmerName,
      image_urls: input.imageUrls || [],
      status: "pending",
      expert_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expert: expert || undefined,
    };

    this.requests.unshift(newRequest);
    return newRequest;
  }

  async getConsultations(params: { farmerId?: string; expertId?: string }): Promise<ConsultationRequest[]> {
    let result = [...this.requests];

    if (params.farmerId) {
      result = result.filter((r) => r.farmer_id === params.farmerId);
    }
    if (params.expertId) {
      result = result.filter((r) => r.expert_id === params.expertId);
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return result;
  }

  async getConsultationById(id: string, userId: string, isAdmin = false): Promise<ConsultationRequest | null> {
    const req = this.requests.find((r) => r.id === id);
    if (!req) return null;

    if (req.farmer_id !== userId && req.expert_id !== userId && !isAdmin) {
      throw new Error("आपल्याला ही सल्ला विनंती पाहण्याची परवानगी नाही (Unauthorized)");
    }

    return req;
  }

  async updateConsultationStatus(
    requestId: string,
    status: ConsultationStatusType,
    notes: string | undefined,
    userId: string,
    isAdmin = false
  ): Promise<ConsultationRequest> {
    const idx = this.requests.findIndex((r) => r.id === requestId);
    if (idx === -1) {
      throw new Error("सल्ला विनंती सापडली नाही (Request not found)");
    }

    const existing = this.requests[idx];
    const isFarmer = existing.farmer_id === userId;
    const isExpert = existing.expert_id === userId;

    if (!isFarmer && !isExpert && !isAdmin) {
      throw new Error("आपल्याला ही विनंती अद्ययावत करण्याची परवानगी नाही (Unauthorized)");
    }

    // Farmer can only cancel
    if (isFarmer && !isExpert && !isAdmin && status !== "cancelled") {
      throw new Error("शेतकरी केवळ विनंती रद्द (cancelled) करू शकतात");
    }

    const updated: ConsultationRequest = {
      ...existing,
      status,
      expert_notes: notes !== undefined ? notes : existing.expert_notes,
      updated_at: new Date().toISOString(),
    };

    this.requests[idx] = updated;
    return updated;
  }
}

export const mockExpertRepository = new MockExpertRepositoryImpl();
