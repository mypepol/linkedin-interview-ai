"use client"

import * as React from "react"
import { Briefcase, FileText, Linkedin, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AdvancedSearchFormProps {
    onAnalyze: (formData: FormData) => void;
    isLoading: boolean;
    className?: string;
}

export function AdvancedSearchForm({ onAnalyze, isLoading, className }: AdvancedSearchFormProps) {
    const [url, setUrl] = React.useState("")
    const [position, setPosition] = React.useState("")
    const [file, setFile] = React.useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return

        const formData = new FormData()
        formData.append("url", url)
        if (position) formData.append("position", position)
        if (file) formData.append("file", file)

        onAnalyze(formData)
    }

    return (
        <form onSubmit={handleSubmit} className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
                {/* URL Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 ml-1">LinkedIn Şirket Linki</label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 pointer-events-none">
                            <Linkedin className="h-5 w-5 text-blue-600" />
                        </div>
                        <Input
                            type="url"
                            placeholder="https://www.linkedin.com/company/..."
                            className="pl-10 h-11"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Position Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Başvurulan Pozisyon (Opsiyonel)</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3 pointer-events-none">
                                <Briefcase className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Örn: Senior Frontend Developer"
                                className="pl-10 h-11"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* File Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">CV Yükle (PDF - Opsiyonel)</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="cv-upload"
                            />
                            <label
                                htmlFor="cv-upload"
                                className="flex items-center justify-center w-full h-11 px-3 py-2 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                <Upload className="h-4 w-4 mr-2 text-slate-400" />
                                <span className="text-sm text-slate-600 truncate">
                                    {file ? file.name : "Dosya Seçiniz..."}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        "Analiz Yapılıyor..."
                    ) : (
                        <>
                            <Search className="h-5 w-5" />
                            Detaylı Kariyer Analizi Başlat
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
