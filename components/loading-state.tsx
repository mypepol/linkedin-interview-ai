"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const loadingMessages = [
    "Şirket verileri taranıyor...",
    "LinkedIn profili analiz ediliyor...",
    "Şirket kültürü inceleniyor...",
    "Vizyon ve misyon değerlendiriliyor...",
    "Mülakat soruları hazırlanıyor...",
    "Sonuçlar derleniyor..."
]

export function LoadingState() {
    const [messageIndex, setMessageIndex] = React.useState(0)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-12 text-center animate-in fade-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight">
                    {loadingMessages[messageIndex]}
                </h3>
                <p className="text-muted-foreground">
                    Bu işlem şirketin büyüklüğüne göre 10-20 saniye sürebilir.
                </p>
            </div>

            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
            </div>
        </div>
    )
}
