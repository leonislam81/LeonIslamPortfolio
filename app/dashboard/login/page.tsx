"use client"

import { FormEvent, useState } from "react"
import { ArrowRight, LockKeyhole } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function DashboardLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add the project credentials before signing in.")
      return
    }

    setLoading(true)
    setMessage("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMessage(error.message)
      return
    }
    window.location.assign("/dashboard")
  }

  return <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-950 sm:px-8"><div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5"><a href="/" className="text-sm font-bold">Leon Islam</a><div className="mt-8 rounded-2xl bg-slate-950 p-4 text-sky-200"><LockKeyhole className="size-5" /></div><p className="mt-6 text-sm font-bold uppercase tracking-[.16em] text-sky-700">Private dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in to manage your audits.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Use the administrator account created in Supabase. This area is not public.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><label className="block text-sm font-semibold">Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>{message && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{message}</p>}<button disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-70">{loading ? "Signing in..." : "Open dashboard"}<ArrowRight className="size-4" /></button></form></div></main>
}
