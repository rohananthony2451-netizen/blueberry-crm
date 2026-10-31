import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth");

  const isInvitationRoute = pathname.startsWith("/invite");

  const isPublicRoute =
    pathname === "/" || isAuthRoute || isInvitationRoute;

  function redirectWithCookies(url: URL) {
    const response = NextResponse.redirect(url);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });

    return response;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // An authentication error must never bypass protected-route checks.
  if (authError || !user) {
    if (!isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return redirectWithCookies(url);
    }

    return supabaseResponse;
  }

  // Verify account status before allowing an authenticated request.
  const { data: isDisabled, error: statusError } =
    await supabase.rpc("is_current_user_disabled");

  // Fail closed if account status cannot be verified.
 if (statusError || typeof isDisabled !== "boolean") {
  return new NextResponse(
    "Unable to verify account access. Please try again shortly.",
    { status: 503 }
  );
}

  if (isDisabled) {
    await supabase.auth.signOut();

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("reason", "access_disabled");

    return redirectWithCookies(url);
  }

  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return redirectWithCookies(url);
  }

  return supabaseResponse;
}
