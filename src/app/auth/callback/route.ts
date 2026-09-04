import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation_failed", url.origin)
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      new URL("/login?error=configuration_error", url.origin)
    );
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
  );

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Confirmation error:", error);

    return NextResponse.redirect(
      new URL("/login?error=confirmation_failed", url.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/login?confirmed=true", url.origin)
  );
}