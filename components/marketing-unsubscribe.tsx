"use client"

import { useState } from "react"

export function MarketingUnsubscribe({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "saving" | "done">("idle")
  const unsubscribe = async () => {
    if (!window.confirm("Remove this contact from the marketing audience?")) return
    setState("saving")
    const response = await fetch("/api/dashboard/marketing/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (response.ok) setState("done")
    else setState("idle")
  }
  if (state === "done") return <span className="text-xs font-semibold text-emerald-700">Removed</span>
  return <button type="button" onClick={unsubscribe} disabled={state === "saving"} className="text-xs font-semibold text-rose-700 hover:underline disabled:opacity-50">{state === "saving" ? "Removing…" : "Unsubscribe"}</button>
}
