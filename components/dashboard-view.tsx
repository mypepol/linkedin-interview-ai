"use client"

import React, { useRef } from 'react';
import { AnalysisResult } from '@/types';
import { CompanyCard } from '@/components/company-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertTriangle, Lightbulb, Users, Target, HelpCircle, User, Briefcase, Mail } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface DashboardViewProps {
    data: AnalysisResult;
}

export function DashboardView({ data }: DashboardViewProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${data.company.name}-Analiz-Raporu`,
    });

    const { company, prep } = data;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Sonuç Paneli</h2>
                    <p className="text-sm text-muted-foreground">{company.name} Analizi Hazır</p>
                </div>
                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    PDF Rapor İndir
                </Button>
            </div>

            {/* Interactive Dashboard Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white p-1 border rounded-lg h-12">
                    <TabsTrigger value="overview">🔍 Genel Bakış</TabsTrigger>
                    <TabsTrigger value="consultant">🤖 Mülakat Simülasyonu</TabsTrigger>
                    <TabsTrigger value="executives">👥 Yönetim Ekibi</TabsTrigger>
                    <TabsTrigger value="cv">📄 CV Analizi</TabsTrigger>
                </TabsList>

                {/* TAB 1: OVERVIEW */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    <CompanyCard company={company} />
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Şirket Kültürü & DNA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-500 italic text-lg text-slate-700 leading-relaxed">
                                &quot;{prep.companyCulture}&quot;
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Genel Kurumsal Sorular</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {prep.generalQuestions?.map((q, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700">
                                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs font-bold">{i + 1}</span>
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: SIMULATION */}
                <TabsContent value="consultant" className="space-y-6 mt-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
                        <h3 className="text-2xl font-bold mb-2">🔥 STAR Tekniği Simülasyonu</h3>
                        <p className="text-indigo-100">
                            CV'nizdeki deneyimlere dayanarak size yöneltilecek zorlayıcı sorular ve <span className="font-bold bg-white/20 px-1 rounded">Mükemmel Cevap</span> taslakları.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {prep.cvDeepDive?.map((item, i) => (
                            <Card key={i} className="border-l-4 border-indigo-500">
                                <CardHeader>
                                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1">Tespit Edilen CV Detayı</div>
                                    <CardDescription className="font-medium text-slate-900 border-b pb-2 italic">
                                        &quot;{item.trigger}&quot;
                                    </CardDescription>
                                    <CardTitle className="text-lg pt-2 flex items-start gap-2">
                                        <HelpCircle className="w-5 h-5 text-red-500 mt-1" />
                                        {item.question}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <div className="flex items-center gap-2 font-bold text-green-800 mb-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Önerilen STAR Cevabı
                                        </div>
                                        <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                                            {item.starAnswer}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* TAB 3: EXECUTIVES */}
                <TabsContent value="executives" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prep.executiveTeam?.map((exec, i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-500">
                                        {exec.name.charAt(0)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{exec.name}</CardTitle>
                                        <CardDescription>{exec.title}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2 space-y-2 text-sm">
                                    {exec.predictedEmail && (
                                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded">
                                            <Mail className="w-3 h-3" />
                                            {exec.predictedEmail}
                                        </div>
                                    )}
                                    {exec.linkedin && (
                                        <a href={exec.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                                            <User className="w-3 h-3" />
                                            LinkedIn Profili
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {(!prep.executiveTeam || prep.executiveTeam.length === 0) && (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                Yönetici bilgisi bulunamadı.
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* TAB 4: CV STATS */}
                <TabsContent value="cv" className="mt-6">
                    <div className="grid place-items-center py-12">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                                <circle className="text-blue-600 stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * prep.cvMatchScore) / 100}></circle>
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-slate-900">{prep.cvMatchScore}</span>
                                <span className="text-xs text-slate-500 uppercase font-bold">Uyum</span>
                            </div>
                        </div>
                        <p className="mt-4 text-center max-w-md text-slate-600">
                            CV'niz bu pozisyon için <strong>%{prep.cvMatchScore}</strong> oranında uygun bulundu.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>

            {/* PRINTABLE HIDDEN COMPONENT */}
            <div style={{ display: "none" }}>
                <div ref={printRef} className="p-10 font-sans text-slate-900 max-w-[210mm] mx-auto">
                    <div className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold mb-2">{company.name} - Mülakat Hazırlık Raporu</h1>
                        <p className="text-slate-500">Oluşturulma Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                    </div>

                    <div className="mb-8 p-4 bg-slate-50 rounded border">
                        <h2 className="text-lg font-bold mb-2 uppercase tracking-wider text-slate-700">Şirket Kültürü</h2>
                        <p>{prep.companyCulture}</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-slate-700 border-b pb-2">Mülakat Simülasyonu</h2>
                        {prep.cvDeepDive?.map((item, i) => (
                            <div key={i} className="mb-6 break-inside-avoid">
                                <p className="font-bold text-slate-800 mb-1">Soru: {item.question}</p>
                                <div className="pl-4 border-l-2 border-slate-300">
                                    <p className="text-sm text-slate-600 italic mb-2">Trigger: {item.trigger}</p>
                                    <p className="text-slate-700 bg-slate-50 p-2 rounded">Cevap İpucu: {item.starAnswer}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-slate-700 border-b pb-2">Yönetim Takımı</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {prep.executiveTeam?.map((exec, i) => (
                                <div key={i} className="border p-3 rounded">
                                    <p className="font-bold">{exec.name}</p>
                                    <p className="text-sm text-slate-500">{exec.title}</p>
                                    {exec.predictedEmail && <p className="text-xs text-slate-400 mt-1">{exec.predictedEmail}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t text-center text-xs text-slate-400">
                        Bu rapor "LinkedIn Interview Prep AI" tarafından kişiye özel oluşturulmuştur.
                    </div>
                </div>
            </div>
        </div>
    );
}
