"use client"

import { useState } from "react"
import { AdvancedSearchForm } from "@/components/url-input-form"
import { Briefcase, FileSearch, Sparkles, Target } from "lucide-react"
import { AnalysisResult } from "@/types"
import { LoadingState } from "@/components/loading-state"
import { DashboardView } from "@/components/dashboard-view"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData, // Auto-sets Content-Type to multipart/form-data
      })

      if (!response.ok) {
        let errorMsg = 'Analiz sırasında bir hata oluştu.'
        try {
          const errData = await response.json()
          errorMsg = errData.error || errorMsg
        } catch (e) { } // eslint-disable-line no-empty
        throw new Error(errorMsg)
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSearch = () => {
    setResult(null)
    setError(null)
  }

  // If we have results, show dashboard
  if (result) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <header className="px-6 py-4 flex items-center justify-between bg-white border-b sticky top-0 z-50">
          <div className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer" onClick={resetSearch}>
            <Briefcase className="h-6 w-6" />
            <span>PrepAI <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">v2.0 Beta</span></span>
          </div>
          <button onClick={resetSearch} className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            Yeni Analiz Yap
          </button>
        </header>
        <div className="p-6 md:p-8">
          <DashboardView data={result} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Briefcase className="h-6 w-6" />
          <span>PrepAI <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Career Coach</span></span>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-5xl mx-auto w-full mb-12">

        {isLoading ? (
          <div className="w-full max-w-lg mx-auto py-12">
            <LoadingState />
          </div>
        ) : (
          <>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 mt-10">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Hayalindeki İşe <br className="hidden md:block" /> <span className="text-blue-600 bg-blue-50 px-2 rounded-lg">Profesyonel</span> Hazırlan
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Yapay Zeka destekli kariyer koçunuz, CV'nizi ve başvuracağınız şirketi analiz ederek size özel mülakat stratejisi oluşturur.
              </p>
            </div>

            <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              <AdvancedSearchForm onAnalyze={handleAnalyze} isLoading={isLoading} className="shadow-2xl" />
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg max-w-2xl mx-auto">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 w-full text-left">
              <FeatureCard
                icon={<FileSearch className="h-6 w-6 text-blue-600" />}
                bgColor="bg-blue-100"
                title="CV Uyumluluk Analizi"
                desc="CV'niz bu pozisyona ne kadar uygun? Eksik anahtar kelimeleri ve güçlü yanlarınızı keşfedin."
              />
              <FeatureCard
                icon={<Target className="h-6 w-6 text-purple-600" />}
                bgColor="bg-purple-100"
                title="Nokta Atışı Sorular"
                desc="Genel sorular değil, o şirketin kültürüne ve başvurduğunuz role özel teknik sorular."
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6 text-green-600" />}
                bgColor="bg-green-100"
                title="İçeriden Bilgiler"
                desc="Şirketin vizyonu, kilit yöneticileri ve mülakatta fark yaratacak stratejik ipuçları."
              />
            </div>
          </>
        )}
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © 2024 PrepAI Career Coach. Powered by Claude 3.5 & Apify.
      </footer>
    </main>
  )
}

function FeatureCard({ icon, bgColor, title, desc }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 space-y-3 hover:shadow-md transition-shadow">
      <div className={`h-12 w-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  )
}
