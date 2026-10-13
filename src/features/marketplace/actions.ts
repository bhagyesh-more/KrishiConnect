"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/features/auth/actions";
import { getMarketplaceRepository } from "./repository";
import {
  createListingSchema,
  updateListingSchema,
  createEnquirySchema,
  updateEnquiryStatusSchema,
  CreateListingInput,
  UpdateListingInput,
  CreateEnquiryInput,
  UpdateEnquiryStatusInput,
} from "./schemas";
import {
  GetListingsOptions,
  SellerInfo,
  BuyerInfo,
  ListingStatus,
} from "./types";
import { MOCK_SELLERS, MOCK_BUYERS } from "./mockRepository";

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

async function resolveUserContext(): Promise<{
  user: { id: string; full_name: string; district: string; taluka?: string | null; phone_number?: string | null; role: string };
  isAdmin: boolean;
  isDemoUser: boolean;
}> {
  const userContext = await getCurrentUserProfile();

  if (userContext?.profile) {
    const profile = userContext.profile as any;
    const roles = userContext.roles.map((r: any) => r.role);
    const isAdmin = roles.includes("admin");
    const isSeller = roles.includes("seller") || roles.includes("farmer");
    const isBuyer = roles.includes("buyer");

    return {
      user: {
        id: profile.id,
        full_name: profile.full_name,
        district: profile.district,
        taluka: profile.taluka,
        phone_number: profile.phone_number,
        role: isAdmin ? "admin" : isSeller ? "farmer" : isBuyer ? "buyer" : "farmer",
      },
      isAdmin,
      isDemoUser: false,
    };
  }

  // Fallback demo context when running in local demonstration mode without credentials
  return {
    user: {
      id: MOCK_SELLERS.farmer_ramesh.id,
      full_name: MOCK_SELLERS.farmer_ramesh.full_name,
      district: MOCK_SELLERS.farmer_ramesh.district,
      taluka: MOCK_SELLERS.farmer_ramesh.taluka,
      phone_number: MOCK_SELLERS.farmer_ramesh.phone_number,
      role: "farmer",
    },
    isAdmin: false,
    isDemoUser: true,
  };
}

export async function getMarketplaceListingsAction(options: GetListingsOptions = {}): Promise<ActionResult> {
  try {
    const repo = getMarketplaceRepository();
    const result = await repo.getListings(options);
    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "याद्या आणण्यात त्रुटी आली (Failed to fetch listings)",
    };
  }
}

export async function getMarketplaceListingDetailAction(id: string): Promise<ActionResult> {
  try {
    const repo = getMarketplaceRepository();
    const listing = await repo.getListingById(id);
    if (!listing) {
      return {
        success: false,
        error: "यादी सापडली नाही (Listing not found)",
      };
    }
    return {
      success: true,
      data: listing,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "यादी आणण्यात त्रुटी आली",
    };
  }
}

export async function createListingAction(input: CreateListingInput): Promise<ActionResult> {
  try {
    const validation = createListingSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध माहिती (Validation failed)",
      };
    }

    const { user } = await resolveUserContext();
    const seller: SellerInfo = {
      id: user.id,
      full_name: user.full_name,
      district: user.district,
      taluka: user.taluka,
      phone_number: user.phone_number,
      role: user.role,
      is_verified: true,
    };

    const repo = getMarketplaceRepository();
    const newListing = await repo.createListing(validation.data, seller);

    revalidatePath("/marketplace");
    return {
      success: true,
      message: "शेतीमाल यादी यशस्वीरित्या प्रसिद्ध करण्यात आली! (Listing published successfully)",
      data: newListing,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "यादी तयार करण्यात त्रुटी आली",
    };
  }
}

export async function updateListingAction(id: string, input: UpdateListingInput): Promise<ActionResult> {
  try {
    const validation = updateListingSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध माहिती",
      };
    }

    const { user, isAdmin } = await resolveUserContext();
    const repo = getMarketplaceRepository();
    const updated = await repo.updateListing(id, validation.data, user.id, isAdmin);

    revalidatePath("/marketplace");
    revalidatePath(`/marketplace/${id}`);
    return {
      success: true,
      message: "यादी अद्ययावत करण्यात आली (Listing updated)",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "यादी सुधारण्यात त्रुटी आली",
    };
  }
}

export async function updateListingStatusAction(id: string, status: ListingStatus): Promise<ActionResult> {
  try {
    const { user, isAdmin } = await resolveUserContext();
    const repo = getMarketplaceRepository();
    const updated = await repo.updateListingStatus(id, status, user.id, isAdmin);

    revalidatePath("/marketplace");
    revalidatePath(`/marketplace/${id}`);
    return {
      success: true,
      message: "यादीची स्थिती बदलण्यात आली (Listing status updated)",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "स्थिती बदलण्यात त्रुटी आली",
    };
  }
}

export async function deleteListingAction(id: string): Promise<ActionResult> {
  try {
    const { user, isAdmin } = await resolveUserContext();
    const repo = getMarketplaceRepository();
    await repo.deleteListing(id, user.id, isAdmin);

    revalidatePath("/marketplace");
    return {
      success: true,
      message: "यादी यशस्वीरित्या हटवण्यात आली (Listing removed)",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "यादी हटवण्यात त्रुटी आली",
    };
  }
}

export async function createEnquiryAction(input: CreateEnquiryInput, buyerOverrideId?: string): Promise<ActionResult> {
  try {
    const validation = createEnquirySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध चौकशी माहिती",
      };
    }

    const { user, isDemoUser } = await resolveUserContext();

    // In local demo mode, if the current demo user is Ramesh Patil (who owns listing 101),
    // default to demo buyer Sunil or the specified buyer override so self-enquiry rule is observed
    let buyerId = user.id;
    let buyerName = user.full_name;
    let buyerDistrict = user.district;
    let buyerPhone = user.phone_number;

    if (buyerOverrideId && MOCK_BUYERS[buyerOverrideId]) {
      const mockB = MOCK_BUYERS[buyerOverrideId];
      buyerId = mockB.id;
      buyerName = mockB.full_name;
      buyerDistrict = mockB.district;
      buyerPhone = mockB.phone_number;
    } else if (isDemoUser) {
      // For demo mode, default buyer is Sunil Wholesale
      buyerId = MOCK_BUYERS.buyer_sunil.id;
      buyerName = MOCK_BUYERS.buyer_sunil.full_name;
      buyerDistrict = MOCK_BUYERS.buyer_sunil.district;
      buyerPhone = MOCK_BUYERS.buyer_sunil.phone_number;
    }

    const buyerInfo: BuyerInfo = {
      id: buyerId,
      full_name: buyerName,
      district: buyerDistrict,
      phone_number: buyerPhone,
      role: "buyer",
    };

    const repo = getMarketplaceRepository();
    const enquiry = await repo.createEnquiry(validation.data, buyerInfo);

    revalidatePath("/marketplace");
    revalidatePath(`/marketplace/${input.listingId}`);
    return {
      success: true,
      message: "चौकशी यशस्वीरित्या पाठवली गेली! (Enquiry sent to seller)",
      data: enquiry,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "चौकशी पाठवण्यात त्रुटी आली",
    };
  }
}

export async function getMyEnquiriesAction(mode: "all" | "sent" | "received" = "all"): Promise<ActionResult> {
  try {
    const { user } = await resolveUserContext();
    const repo = getMarketplaceRepository();

    let enquiries;
    if (mode === "sent") {
      enquiries = await repo.getEnquiries({ buyerId: user.id });
    } else if (mode === "received") {
      enquiries = await repo.getEnquiries({ sellerId: user.id });
    } else {
      const [sent, received] = await Promise.all([
        repo.getEnquiries({ buyerId: user.id }),
        repo.getEnquiries({ sellerId: user.id }),
      ]);
      const combined = [...sent, ...received];
      const seen = new Set<string>();
      enquiries = combined.filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
    }

    return {
      success: true,
      data: enquiries,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "चौकशी आणण्यात त्रुटी आली",
    };
  }
}

export async function updateEnquiryStatusAction(input: UpdateEnquiryStatusInput): Promise<ActionResult> {
  try {
    const validation = updateEnquiryStatusSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "अवैध माहिती",
      };
    }

    const { user, isAdmin } = await resolveUserContext();
    const repo = getMarketplaceRepository();
    const updated = await repo.updateEnquiryStatus(
      validation.data.enquiryId,
      validation.data.status,
      validation.data.statusNotes,
      user.id,
      isAdmin
    );

    revalidatePath("/marketplace");
    return {
      success: true,
      message: "चौकशीची स्थिती बदलण्यात आली (Enquiry status updated)",
      data: updated,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "स्थिती अद्ययावत करण्यात त्रुटी आली",
    };
  }
}
