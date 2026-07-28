"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Globe2, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Language = {
  code: string
  label: string
  native: string
}

const languages: Language[] = [
  { code: "EN", label: "English", native: "English" },
  { code: "BN", label: "Bengali", native: "বাংলা" },
  { code: "HI", label: "Hindi", native: "हिन्दी" },
  { code: "HR", label: "Croatian", native: "Hrvatski" },
  { code: "NL", label: "Dutch", native: "Nederlands" },
  { code: "FR", label: "French", native: "Français" },
  { code: "DE", label: "German", native: "Deutsch" },
  { code: "ES", label: "Spanish", native: "Español" },
  { code: "IT", label: "Italian", native: "Italiano" },
  { code: "PT-PT", label: "Portuguese", native: "Português" },
  { code: "PT-BR", label: "Portuguese (Brazil)", native: "Português (Brasil)" },
  { code: "PL", label: "Polish", native: "Polski" },
  { code: "RO", label: "Romanian", native: "Română" },
  { code: "TR", label: "Turkish", native: "Türkçe" },
  { code: "UK", label: "Ukrainian", native: "Українська" },
  { code: "AR", label: "Arabic", native: "العربية" },
  { code: "JA", label: "Japanese", native: "日本語" },
  { code: "KO", label: "Korean", native: "한국어" },
  { code: "ZH-HANS", label: "Chinese (Simplified)", native: "简体中文" },
  { code: "ZH-HANT", label: "Chinese (Traditional)", native: "繁體中文" },
  { code: "TA", label: "Tamil", native: "தமிழ்" },
  { code: "TE", label: "Telugu", native: "తెలుగు" },
  { code: "MR", label: "Marathi", native: "मराठी" },
]

const originalText = new WeakMap<Text, string>()
const translationCache = new Map<string, string>()

function shouldTranslate(node: Text) {
  const parent = node.parentElement
  if (!parent || !node.nodeValue?.trim()) return false
  if (parent.closest("[data-no-translate], script, style, noscript, svg, textarea, input, select, option, [contenteditable='true']")) return false
  const text = node.nodeValue.trim()
  return !/^([\d\s.,:+%/–—-]+|https?:\/\/\S+|\S+@\S+\.\S+)$/.test(text)
}

function collectTextNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let node = walker.nextNode() as Text | null
  while (node) {
    if (shouldTranslate(node)) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue || "")
      nodes.push(node)
    }
    node = walker.nextNode() as Text | null
  }
  return nodes
}

function getLanguage(code: string) {
  return languages.find((language) => language.code === code) || languages[0]
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState("EN")
  const [recommendedCodes, setRecommendedCodes] = useState<string[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)
  const applyingRef = useRef(false)

  const restoreEnglish = () => {
    const nodes = collectTextNodes()
    applyingRef.current = true
    nodes.forEach((node) => {
      const source = originalText.get(node)
      if (source !== undefined) node.nodeValue = source
    })
    applyingRef.current = false
    document.documentElement.lang = "en"
    document.documentElement.dir = "ltr"
  }

  const translatePage = async (languageCode: string) => {
    if (languageCode === "EN") {
      restoreEnglish()
      return
    }

    restoreEnglish()
    const nodes = collectTextNodes()
    const sourceTexts = nodes.map((node) => originalText.get(node) || node.nodeValue || "")
    const pending = new Map<string, Text[]>()

    sourceTexts.forEach((text, index) => {
      const cacheKey = `${languageCode}:${text}`
      const translated = translationCache.get(cacheKey)
      if (translated) {
        nodes[index].nodeValue = translated
      } else {
        pending.set(text, [...(pending.get(text) || []), nodes[index]])
      }
    })

    const uniqueTexts = [...pending.keys()]
    for (let index = 0; index < uniqueTexts.length; index += 40) {
      const batch = uniqueTexts.slice(index, index + 40)
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: batch, targetLanguage: languageCode }),
      })
      const data = (await response.json()) as { translations?: string[]; error?: string }
      if (!response.ok || !data.translations) throw new Error(data.error || "Translation failed")

      applyingRef.current = true
      batch.forEach((text, batchIndex) => {
        const translated = data.translations?.[batchIndex] || text
        translationCache.set(`${languageCode}:${text}`, translated)
        pending.get(text)?.forEach((node) => {
          node.nodeValue = translated
        })
      })
      applyingRef.current = false
    }

    const language = getLanguage(languageCode)
    document.documentElement.lang = languageCode.toLowerCase()
    document.documentElement.dir = languageCode === "AR" ? "rtl" : "ltr"
  }

  const selectLanguage = async (languageCode: string) => {
    if (isTranslating || languageCode === selectedCode) {
      setOpen(false)
      return
    }

    setOpen(false)
    setIsTranslating(true)
    setError("")
    try {
      await translatePage(languageCode)
      setSelectedCode(languageCode)
      localStorage.setItem("leon-site-language", languageCode)
    } catch (translationError) {
      restoreEnglish()
      setSelectedCode("EN")
      localStorage.setItem("leon-site-language", "EN")
      setError(translationError instanceof Error ? translationError.message : "Translation could not be completed.")
    } finally {
      setIsTranslating(false)
    }
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem("leon-site-language")
    if (savedLanguage && getLanguage(savedLanguage).code === savedLanguage) {
      void selectLanguage(savedLanguage)
    }

    void fetch("/api/language-recommendations")
      .then((response) => response.json())
      .then((data: { languages?: string[] }) => setRecommendedCodes(data.languages?.filter((code) => getLanguage(code).code === code) || []))
      .catch(() => undefined)

    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const selectedLanguage = getLanguage(selectedCode)
  const recommendedLanguages = languages.filter((language) => recommendedCodes.includes(language.code) && language.code !== "EN")
  const otherLanguages = languages.filter((language) => !recommendedCodes.includes(language.code) || language.code === "EN")

  return (
    <div ref={menuRef} className="relative" data-no-translate>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="gap-1.5 rounded-full border-slate-200 bg-white/80 px-3 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-800"
      >
        {isTranslating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Globe2 className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{selectedLanguage.native}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>

      {open && (
        <div role="dialog" aria-label="Choose website language" className="absolute right-0 top-full z-[70] mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950">
          <div className="px-3 pb-2 pt-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Website language</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Translation stays on this site. Your link will not change.</p>
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
            {recommendedLanguages.length > 0 && (
              <>
                <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Suggested for your region</p>
                {recommendedLanguages.map((language) => <LanguageOption key={language.code} language={language} selected={selectedCode === language.code} onSelect={selectLanguage} />)}
                <div className="my-2 border-t border-slate-100 dark:border-slate-800" />
              </>
            )}
            {otherLanguages.map((language) => <LanguageOption key={language.code} language={language} selected={selectedCode === language.code} onSelect={selectLanguage} />)}
          </div>
          {error && <p role="status" className="px-3 pb-1 pt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
        </div>
      )}
    </div>
  )
}

function LanguageOption({ language, selected, onSelect }: { language: Language; selected: boolean; onSelect: (code: string) => void }) {
  return (
    <button type="button" onClick={() => void onSelect(language.code)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-sky-50 dark:hover:bg-slate-900">
      <span className="text-slate-800 dark:text-slate-100"><span className="font-medium">{language.native}</span><span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{language.label}</span></span>
      {selected && <Check className="h-4 w-4 text-sky-500" />}
    </button>
  )
}
