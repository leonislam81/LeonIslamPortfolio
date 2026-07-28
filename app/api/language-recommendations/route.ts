import { headers } from "next/headers"
import { NextResponse } from "next/server"

const countryLanguages: Record<string, string[]> = {
  BD: ["BN"],
  IN: ["HI", "BN", "TA", "TE", "MR"],
  HR: ["HR"],
  BE: ["NL", "FR", "DE"],
  NL: ["NL"],
  DE: ["DE"],
  FR: ["FR"],
  ES: ["ES"],
  IT: ["IT"],
  PT: ["PT-PT"],
  BR: ["PT-BR"],
  PL: ["PL"],
  RO: ["RO"],
  TR: ["TR"],
  UA: ["UK"],
  JP: ["JA"],
  KR: ["KO"],
  CN: ["ZH-HANS"],
  TW: ["ZH-HANT"],
  SA: ["AR"],
  AE: ["AR"],
}

export async function GET() {
  const requestHeaders = await headers()
  const country = requestHeaders.get("x-vercel-ip-country")?.toUpperCase() || ""
  return NextResponse.json({ languages: countryLanguages[country] || [] })
}
