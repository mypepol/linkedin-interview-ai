"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function UrlInputForm({ className }: { className?: string }) {
    const [url, setUrl] = React.useState("")
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return

        // Encode the URL and navigate to results page
        const encodedUrl = encodeURIComponent(url)
        router.push(`/results?url=${encodedUrl}`)
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative w-full max-w-2xl mx-auto", className)}>
            <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                </div>
                <Input
                    type="url"
                    placeholder="https://www.linkedin.com/company/..."
                    className="h-14 pl-12 pr-32 text-base shadow-lg border-2 border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded-xl"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    className="absolute right-2 h-10 px-6 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                    Analiz Et
                </Button>
            </div>
            <p className="mt-3 text-xs text-center text-muted-foreground">
                Örnek: linkedin.com/company/microsoft • linkedin.com/company/google
            </p>
        </form>
    )
}
