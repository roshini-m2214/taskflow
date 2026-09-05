import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase-server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("AUTH CALLBACK: No code received");

    return NextResponse.redirect(
      new URL("/login?error=no_code", url.origin)
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "AUTH CALLBACK EXCHANGE ERROR:",
        error.message
      );

      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          url.origin
        )
      );
    }

    console.log(
      "AUTH CALLBACK SUCCESS:",
      data.user?.email
    );

    return NextResponse.redirect(
      new URL("/dashboard", url.origin)
    );
  } catch (error) {
    console.error("AUTH CALLBACK EXCEPTION:", error);

    return NextResponse.redirect(
      new URL("/login?error=callback_exception", url.origin)
    );
  }
}