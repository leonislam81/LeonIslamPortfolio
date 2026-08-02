import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next({ request })

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (user && request.nextUrl.pathname !== "/dashboard/login") {
    const { data: membership } = await supabase.from("dashboard_users").select("role,status").eq("user_id", user.id).maybeSingle()
    if (membership?.status === "Disabled") {
      return NextResponse.redirect(new URL("/dashboard/login", request.url))
    }
    if (membership?.role && membership.role !== "Owner" && membership.role !== "Administrator") {
      const path = request.nextUrl.pathname
      const allowed = path === "/dashboard" || path.startsWith("/dashboard/notifications") || path.startsWith("/dashboard/bookings") || (path.startsWith("/dashboard/content") || path.startsWith("/dashboard/site-management")) && ["Editor", "Author", "Contributor"].includes(membership.role) || (path.startsWith("/dashboard/projects") || path.startsWith("/dashboard/leads") || path.startsWith("/dashboard/marketing") || path.startsWith("/dashboard/campaigns")) && membership.role === "Editor"
      if (!allowed) return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }
  return response
}

export const config = { matcher: ["/dashboard/:path*"] }
