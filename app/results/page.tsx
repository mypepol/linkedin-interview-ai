"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/loading-state"
import { CompanyCard } from "@/components/company-card"
import { InterviewReport } from "@/components/interview-report"
import { AnalysisResult } from "@/types"

function ResultsContent() {
    const searchParams = useSearchParams()
    const url = searchParams.get('url')
    const router = useRouter()

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [data, setData] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!url) {
            router.push('/')
            return
        }

        const fetchData = async () => {
            setStatus('loading')
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                })

                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result.error || 'Bir hata oluştu.')
                }

                setData(result)
                setStatus('success')
            } catch (err: any) {
                setError(err.message || 'Veri çekilemedi.')
                setStatus('error')
            }
        }

        fetchData()
    }, [url, router])

    if (status === 'loading' || status === 'idle') {
        return <LoadingState />
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-in fade-in">
                <div className="text-red-500 bg-red-50 p-4 rounded-full">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Analiz Başarısız Oldu</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    {error}
                </p>
                <Link href="/">
                    <Button variant="outline">Ana Sayfaya Dön</Button>
                </Link>
            </div>
        )
    }

    if (status === 'success' && data) {
        return (
            <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                <div className="flex items-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600">
                            <ArrowLeft className="h-4 w-4" />
                            Yeni Analiz Yap
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <CompanyCard company={data.company} />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <InterviewReport prep={data.prep} />
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <Suspense fallback={<LoadingState />}>
                    <ResultsContent />
                </Suspense>
            </div>
        </div>
    )
}
