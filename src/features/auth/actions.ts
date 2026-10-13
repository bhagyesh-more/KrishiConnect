"use server";

import { createClient } from "@/lib/supabase/server";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  updateProfileSchema,
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  UpdateProfileInput,
} from "./schemas";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export async function signUpAction(input: RegisterInput): Promise<ActionResult> {
  const validation = registerSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध माहिती (Invalid data)",
    };
  }

  const { email, password, fullName, district, taluka, role, preferredLanguage } = validation.data;
  const supabase = createClient();

  // Check if Supabase credentials are configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
  ) {
    return {
      success: false,
      error: "Supabase प्रकल्प अद्याप जोडलेला नाही. कृपया .env.local मध्ये NEXT_PUBLIC_SUPABASE_URL व NEXT_PUBLIC_SUPABASE_ANON_KEY जोडा. (Supabase is not configured yet).",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        district,
        taluka: taluka || null,
        role,
        preferred_language: preferredLanguage,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // If email confirmation is required, inform the user
  if (data.user && !data.session) {
    return {
      success: true,
      message: "नोंदणी यशस्वी झाली! कृपया खात्याच्या पडताळणीसाठी आपला ईमेल तपासा. (Registration successful. Please verify your email).",
      data: { requiresEmailVerification: true },
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "नोंदणी यशस्वी झाली! (Registration successful!)",
    data: { user: data.user },
  };
}

export async function signInAction(input: LoginInput): Promise<ActionResult> {
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध लॉगिन माहिती (Invalid login data)",
    };
  }

  const { email, password } = validation.data;
  const supabase = createClient();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
  ) {
    return {
      success: false,
      error: "Supabase जोडणी आढळली नाही. कृपया .env.local मध्ये वैध Supabase URL व Anon Key प्रविष्ट करा.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "लॉगिन यशस्वी झाले! (Login successful)",
    data: { user: data.user },
  };
}

export async function signOutAction(): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "लॉगआउट झाले (Logged out successfully)" };
}

export async function resetPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const validation = forgotPasswordSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध ईमेल",
    };
  }

  const { email } = validation.data;
  const supabase = createClient();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
  ) {
    return {
      success: false,
      error: "Supabase प्रकल्प अद्याप जोडलेला नाही.",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवण्यात आली आहे. (Password reset link sent to your email).",
  };
}

export async function getCurrentUserProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: roles } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id);

  return {
    user,
    profile,
    roles: roles || [],
  };
}

export async function updateProfileAction(input: UpdateProfileInput): Promise<ActionResult> {
  const validation = updateProfileSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "अवैध माहिती",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "सत्र कालबाह्य झाले आहे. कृपया पुन्हा लॉगिन करा. (Session expired)",
    };
  }

  const { fullName, phoneNumber, district, taluka, village, preferredLanguage } = validation.data;

  const { error } = await (supabase.from("profiles") as any)
    .update({
      full_name: fullName,
      phone_number: phoneNumber || null,
      district,
      taluka: taluka || null,
      village: village || null,
      preferred_language: preferredLanguage,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/profile");
  return {
    success: true,
    message: "प्रोफाइल यशस्वीरित्या अपडेट करण्यात आले! (Profile updated successfully)",
  };
}
