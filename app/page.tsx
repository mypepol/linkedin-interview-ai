import { UrlInputForm } from "@/components/url-input-form"
import { Briefcase, FileSearch, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Briefcase className="h-6 w-6" />
          <span>PrepAI</span>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-4xl mx-auto w-full">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Mülakatlara <span className="text-blue-600">Yapay Zeka</span> ile Hazırlanın
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Gireceğiniz şirketin LinkedIn profilini paylaşın, AI teknolojimiz sizin için şirket kültürünü analiz etsin ve çıkabilecek mülakat sorularını hazırlasın.
          </p>
        </div>

        <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          <UrlInputForm className="shadow-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 w-full text-left">
          <div className="p-6 bg-white rounded-xl shadow-sm border space-y-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FileSearch className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">1. Profili Analiz Et</h3>
            <p className="text-muted-foreground text-sm">
              Şirketin LinkedIn profilini tarayarak vizyon, kültür ve değerlerini ortaya çıkarıyoruz.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border space-y-3">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">2. Soruları Hazırla</h3>
            <p className="text-muted-foreground text-sm">
              Şirkete özel teknik ve davranışsal mülakat sorularını GPT-4 ile üretiyoruz.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border space-y-3">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">3. İşe Hazır Ol</h3>
            <p className="text-muted-foreground text-sm">
              Ters mülakat soruları ve kültür ipuçları ile görüşmede fark yaratın.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        © 2024 PrepAI. All rights reserved.
      </footer>
    </main>
  )
}
