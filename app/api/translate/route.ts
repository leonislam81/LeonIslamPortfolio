import { NextRequest, NextResponse } from "next/server"

const MAX_TEXTS = 50
const MAX_CHARACTERS = 16_000
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 40

const requestWindows = new Map<string, { count: number; startedAt: number }>()

function isRateLimited(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || "anonymous"
  const now = Date.now()
  const current = requestWindows.get(ip)

  if (!current || now - current.startedAt > WINDOW_MS) {
    requestWindows.set(ip, { count: 1, startedAt: now })
    return false
  }

  current.count += 1
  return current.count > MAX_REQUESTS_PER_WINDOW
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: "Too many translation requests. Please try again shortly." }, { status: 429 })
  }

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Translation is not configured yet." }, { status: 503 })
  }

  let body: { texts?: unknown; targetLanguage?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid translation request." }, { status: 400 })
  }

  const texts = Array.isArray(body.texts) ? body.texts.filter((text): text is string => typeof text === "string" && text.trim().length > 0) : []
  const targetLanguage = typeof body.targetLanguage === "string" ? body.targetLanguage.toUpperCase() : ""

  if (!/^[A-Z]{2,3}(?:-[A-Z]{2,4})?$/.test(targetLanguage) || texts.length === 0 || texts.length > MAX_TEXTS) {
    return NextResponse.json({ error: "Invalid translation request." }, { status: 400 })
  }

  if (texts.reduce((total, text) => total + text.length, 0) > MAX_CHARACTERS) {
    return NextResponse.json({ error: "Translation request is too large." }, { status: 413 })
  }

  const formData = new URLSearchParams()
  formData.set("source_lang", "EN")
  formData.set("target_lang", targetLanguage)
  texts.forEach((text) => formData.append("text", text))

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("DeepL translation request failed", response.status)
      return NextResponse.json({ error: "Translation is temporarily unavailable." }, { status: 502 })
    }

    const data = (await response.json()) as { translations?: Array<{ text?: string }> }
    const translations = data.translations?.map((translation) => translation.text || "")

    if (!translations || translations.length !== texts.length) {
      return NextResponse.json({ error: "Translation returned an unexpected response." }, { status: 502 })
    }

    return NextResponse.json({ translations })
  } catch (error) {
    console.error("DeepL translation request failed", error)
    return NextResponse.json({ error: "Translation is temporarily unavailable." }, { status: 502 })
  }
}
