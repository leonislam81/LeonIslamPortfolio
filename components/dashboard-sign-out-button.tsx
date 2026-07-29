"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function DashboardSignOutButton() {
  const [loading, setLoading] = useState(false)

  const signOut = async () => {
    setLoading(true)
    await createSupabaseBrowserClient()?.auth.signOut()
    window.location.assign("/dashboard/login")
  }

  return <button type="button" onClick={signOut} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-70"><LogOut className="size-4" />{loading ? "Signing out..." : "Log out"}</button>
}
