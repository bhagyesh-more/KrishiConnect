import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNextUrl } from "@/features/auth/utils";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const safeNext = sanitizeNextUrl(rawNext);

  // Derive host to support proxy/load-balancer configurations in production
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(new URL(safeNext, baseUrl));
      }
    } catch {
      // Supabase or network error during exchange; fall through to failure redirect
    }
  }

  // If code is missing or exchange fails, redirect safely to login with error code
  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", baseUrl));
}
