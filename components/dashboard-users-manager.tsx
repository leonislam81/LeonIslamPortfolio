"use client"

import { FormEvent, useEffect, useState } from "react"
import { Check, MailPlus, ShieldCheck, UserRound, UsersRound } from "lucide-react"

type NotificationPreferences = { bookings: boolean; leads: boolean; campaigns: boolean; users: boolean }
type DashboardUser = { user_id: string; email: string; display_name: string | null; role: string; status: string; notification_preferences?: NotificationPreferences; created_at: string }
const roleDescriptions: Record<string, string> = {
  Owner: "Full control, including user access.", Administrator: "Manage the dashboard and content.", Editor: "Create, edit, publish, and manage content.", Author: "Create and edit their own content.", Contributor: "Create drafts for review.", Viewer: "Read-only dashboard access.",
}

export function DashboardUsersManager() {
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState("Viewer")

  const loadUsers = async () => {
    const response = await fetch("/api/dashboard/users", { cache: "no-store" })
    const payload = await response.json()
    if (!response.ok) setError(payload.error ?? "Could not load dashboard users.")
    else setUsers(payload.users ?? [])
    setLoading(false)
  }
  useEffect(() => { void loadUsers() }, [])

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(""); setError("")
    const response = await fetch("/api/dashboard/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, displayName, role }) })
    const payload = await response.json()
    if (!response.ok) { setError(payload.error ?? "Invitation failed."); return }
    setEmail(""); setDisplayName(""); setRole("Viewer"); setMessage("Invitation sent. The user can use the email link to create their password."); await loadUsers()
  }

  const updateUser = async (userId: string, field: "role" | "status", value: string) => {
    setError("")
    const response = await fetch("/api/dashboard/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, [field]: value }) })
    const payload = await response.json()
    if (!response.ok) setError(payload.error ?? "Could not update this user.")
    else setUsers((current) => current.map((user) => user.user_id === userId ? { ...user, [field]: value } : user))
  }

  const updatePreference = async (user: DashboardUser, key: keyof NotificationPreferences, value: boolean) => {
    setError("")
    const preferences = { bookings: true, leads: true, campaigns: true, users: true, ...user.notification_preferences, [key]: value }
    const response = await fetch("/api/dashboard/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.user_id, notificationPreferences: preferences }) })
    const payload = await response.json()
    if (!response.ok) setError(payload.error ?? "Could not update notification preferences.")
    else setUsers((current) => current.map((item) => item.user_id === user.user_id ? { ...item, notification_preferences: preferences } : item))
  }

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-7"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Workspace access</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Users</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Invite people to your dashboard and choose what they can do. Roles work like WordPress: give each person only the level of access they need.</p></div><div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><UsersRound className="size-5 text-sky-300" />{users.length} member{users.length === 1 ? "" : "s"}</div></header>
    {error && <p role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">{error}</p>}{message && <p role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800"><Check className="mr-2 inline size-4" />{message}</p>}
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><span className="rounded-xl bg-sky-100 p-3 text-sky-700"><MailPlus className="size-5" /></span><div><h2 className="text-xl font-bold">Invite a user</h2><p className="mt-1 text-sm text-slate-500">Supabase will email them a secure invitation.</p></div></div><form onSubmit={invite} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Full name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Alex Morgan" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><label className="text-sm font-semibold">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="alex@example.com" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><label className="text-sm font-semibold sm:col-span-2">Role<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100">{Object.keys(roleDescriptions).filter((item) => item !== "Owner").map((item) => <option key={item}>{item}</option>)}</select><span className="mt-1 block text-xs font-normal text-slate-500">{roleDescriptions[role]}</span></label><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 sm:col-span-2"><MailPlus className="size-4" />Send invitation</button></form></section>
      <aside className="rounded-3xl bg-slate-950 p-6 text-white"><ShieldCheck className="size-7 text-sky-300" /><h2 className="mt-5 text-xl font-bold">Role guide</h2><div className="mt-5 space-y-4">{Object.entries(roleDescriptions).map(([name, description]) => <div key={name}><p className="text-sm font-bold text-sky-200">{name}</p><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></div>)}</div></aside></div>
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><h2 className="text-xl font-bold">Dashboard members</h2><p className="mt-1 text-sm text-slate-500">Change access and choose which alerts each person receives.</p></div>{loading ? <p className="px-6 py-8 text-sm text-slate-500">Loading users...</p> : users.length === 0 ? <p className="px-6 py-8 text-sm text-slate-500">No dashboard members yet.</p> : <div className="divide-y divide-slate-100">{users.map((user) => { const preferences = { bookings: true, leads: true, campaigns: true, users: true, ...user.notification_preferences }; return <div key={user.user_id} className="flex flex-col gap-4 px-6 py-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-700"><UserRound className="size-5" /></span><div><p className="font-bold">{user.display_name || user.email}</p><p className="text-sm text-slate-500">{user.email}</p></div></div><div className="flex flex-wrap items-center gap-3"><select value={user.role} onChange={(event) => void updateUser(user.user_id, "role", event.target.value)} disabled={user.role === "Owner"} aria-label={`Role for ${user.email}`} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold disabled:bg-slate-50 disabled:text-slate-400">{Object.keys(roleDescriptions).map((item) => <option key={item}>{item}</option>)}</select><select value={user.status} onChange={(event) => void updateUser(user.user_id, "status", event.target.value)} disabled={user.role === "Owner"} aria-label={`Status for ${user.email}`} className={`min-h-10 rounded-xl border px-3 text-sm font-semibold ${user.status === "Active" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : user.status === "Invited" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-100 text-slate-600"}`}><option>Invited</option><option>Active</option><option>Disabled</option></select></div></div><div className="flex flex-wrap gap-x-5 gap-y-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600"><span className="w-full text-[10px] uppercase tracking-[.16em] text-slate-400">Notification preferences</span>{([['bookings', 'Bookings'], ['leads', 'Leads'], ['campaigns', 'Campaigns'], ['users', 'User changes']] as Array<[keyof NotificationPreferences, string]>).map(([key, label]) => <label key={key} className="inline-flex items-center gap-2"><input type="checkbox" checked={preferences[key]} onChange={(event) => void updatePreference(user, key, event.target.checked)} disabled={user.role === "Owner"} className="size-4 rounded border-slate-300 text-sky-700" />{label}</label>)}</div></div> })}</div>}</section>
  </div></main>
}
