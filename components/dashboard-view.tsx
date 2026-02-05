"use client"

import React, { useRef } from 'react';
import { AnalysisResult } from '@/types';
import { CompanyCard } from '@/components/company-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertTriangle, Lightbulb, Users, Target, HelpCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface DashboardViewProps {
    data: AnalysisResult;
}

export function DashboardView({ data }: DashboardViewProps) {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        if (!reportRef.current) return;
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${data.company.name}-interview-prep.pdf`);
    };

    const { company, prep } = data;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Kariyer Analiz Raporu
                </h2>
                <Button onClick={handleDownloadPdf} variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    PDF İndir
                </Button>
            </div>

            {/* Bu kısım PDF'e basılacak */}
            <div ref={reportRef} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">

                <CompanyCard company={company} />

                <Tabs defaultValue="interview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 p-1">
                        <TabsTrigger value="interview" className="text-base">🎯 Mülakat Soruları</TabsTrigger>
                        <TabsTrigger value="cv" className="text-base">📄 CV Analizi</TabsTrigger>
                        <TabsTrigger value="company" className="text-base">🏢 Şirket İstihbaratı</TabsTrigger>
                    </TabsList>

                    {/* MÜLAKAT SORULARI TABI */}
                    <TabsContent value="interview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Target className="text-blue-600" />
                                    Rol Bazlı & Stratejik Sorular
                                </CardTitle>
                                <CardDescription>Bu pozisyon için size yöneltilebilecek en olası sorular.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Accordion type="single" collapsible className="w-full">
                                    {prep.roleSpecificQuestions?.map((q, i) => (
                                        <AccordionItem key={`role-${i}`} value={`role-${i}`}>
                                            <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-blue-600">
                                                {i + 1}. {q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground italic bg-slate-50 p-3 rounded">
                                                İpucu: Bu soruyu cevaplarken geçmiş projelerinizdeki somut başarılarınızdan (STAR tekniği) örnek veriniz.
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <HelpCircle className="text-indigo-600" />
                                    Tersine Mülakat (Sizin Soracaklarınız)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {prep.reverseInterviewQuestions?.map((q, i) => (
                                        <li key={i} className="flex gap-3 text-slate-700">
                                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                {i + 1}
                                            </span>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CV ANALİZİ TABI */}
                    <TabsContent value="cv" className="space-y-6">
                        {prep.cvAnalysis ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Skor Kartı */}
                                <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                                    <CardHeader>
                                        <CardTitle className="text-center text-xl text-slate-200">Pozisyon Uyumluluk Skoru</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center pb-8">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle className="text-slate-700 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                                                <circle className="text-green-500 progress-ring__circle stroke-current" strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * prep.cvAnalysis.matchScore) / 100} style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}></circle>
                                            </svg>
                                            <span className="absolute text-3xl font-bold">{prep.cvAnalysis.matchScore}%</span>
                                        </div>
                                        <p className="text-slate-400 mt-2 text-sm italic">
                                            {prep.cvAnalysis.matchScore > 80 ? "Harika bir eşleşme! 🚀" : prep.cvAnalysis.matchScore > 50 ? "Güçlü bir profil ama iyileştirmeler gerek. 🛠️" : "Bazı kritik yetkinlikler eksik görünüyor. 📉"}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-green-100 bg-green-50/50">
                                    <CardHeader>
                                        <CardTitle className="text-green-700 flex items-center gap-2 text-lg">
                                            <CheckCircle className="w-5 h-5" />
                                            Güçlü Yönleriniz
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                            {prep.cvAnalysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="border-amber-100 bg-amber-50/50">
                                    <CardHeader>
                                        <CardTitle className="text-amber-700 flex items-center gap-2 text-lg">
                                            <AlertTriangle className="w-5 h-5" />
                                            Gelişim Alanları
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                            {prep.cvAnalysis.missingKeywords?.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="md:col-span-2 border-blue-100 bg-blue-50/30">
                                    <CardHeader>
                                        <CardTitle className="text-blue-700 flex items-center gap-2 text-lg">
                                            <Lightbulb className="w-5 h-5" />
                                            Kariyer Koçu Tavsiyeleri
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {prep.cvAnalysis.recommendations?.map((r, i) => (
                                                <li key={i} className="flex gap-3 text-slate-700 bg-white p-3 rounded border border-blue-100 shadow-sm">
                                                    <span className="font-bold text-blue-500">#{i + 1}</span>
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                <p className="text-muted-foreground">CV yüklemediğiniz için bu analiz görüntülenemiyor.</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* ŞİRKET İSTİHBARATI TABI */}
                    <TabsContent value="company" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Vizyon & Kültür</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-500 uppercase mb-1">Vizyon Özeti</h4>
                                    <p className="text-lg font-medium text-slate-800 leading-relaxed">
                                        &quot;{prep.visionSummary}&quot;
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-500 uppercase mb-1">Kültür Analizi</h4>
                                    <p className="text-slate-600">
                                        {prep.cultureAnalysis}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Users className="text-purple-600" />
                                    Kilit İsimler
                                </CardTitle>
                                <CardDescription>Mülakatta karşılaşabileceğiniz veya referans verebileceğiniz isimler.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {prep.keyPeople?.map((person, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-white border rounded-lg shadow-sm hover:border-purple-200 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                                {person.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{person.name}</p>
                                                <p className="text-sm text-slate-500">{person.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!prep.keyPeople || prep.keyPeople.length === 0) && (
                                        <p className="text-muted-foreground text-sm col-span-2">Kilit personel bilgisi bulunamadı.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
