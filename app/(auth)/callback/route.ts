import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const invitationToken =
    requestUrl.searchParams.get("invite");

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = invitationToken
        ? `/invite/${encodeURIComponent(invitationToken)}`
        : "/dashboard";

      return NextResponse.redirect(
        new URL(destination, requestUrl.origin)
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/login?error=auth_callback_failed",
      requestUrl.origin
    )
  );
}