import { InterviewPrepData } from "@/types"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Lightbulb, Target, Users, MessageSquare, Briefcase } from "lucide-react"

export function InterviewReport({ prep }: { prep: InterviewPrepData }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-primary">
                    Mülakat Hazırlık Raporu
                </h2>
            </div>

            <Accordion type="single" collapsible defaultValue="vision" className="w-full">

                <AccordionItem value="vision">
                    <AccordionTrigger className="text-lg font-semibold text-slate-800">
                        <div className="flex items-center">
                            <Target className="mr-3 h-5 w-5 text-blue-600" />
                            Şirket Vizyonu
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 pr-3 rounded-r">
                        &quot;{prep.visionSummary}&quot;
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="culture">
                    <AccordionTrigger className="text-lg font-semibold text-slate-800">
                        <div className="flex items-center">
                            <Users className="mr-3 h-5 w-5 text-green-600" />
                            Kültür Analizi
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-slate-600 leading-relaxed">
                        {prep.cultureAnalysis}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="behavioral">
                    <AccordionTrigger className="text-lg font-semibold text-slate-800">
                        <div className="flex items-center">
                            <MessageSquare className="mr-3 h-5 w-5 text-purple-600" />
                            Davranışsal Sorular
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-3">
                            {prep.behavioralQuestions.map((q, i) => (
                                <li key={i} className="flex gap-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                                        {i + 1}
                                    </span>
                                    <span className="text-slate-700 font-medium">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="technical">
                    <AccordionTrigger className="text-lg font-semibold text-slate-800">
                        <div className="flex items-center">
                            <Lightbulb className="mr-3 h-5 w-5 text-amber-600" />
                            Teknik/Sektörel Sorular
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-3">
                            {prep.technicalQuestions.map((q, i) => (
                                <li key={i} className="flex gap-3 bg-slate-50 p-3 rounded-md border border-slate-100">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">
                                        {i + 1}
                                    </span>
                                    <span className="text-slate-700 font-medium">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reverse">
                    <AccordionTrigger className="text-lg font-semibold text-slate-800">
                        <div className="flex items-center">
                            <Target className="mr-3 h-5 w-5 text-red-600" />
                            Sorman Gereken Sorular (Reverse Interview)
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="mb-3 text-sm text-muted-foreground">
                            Mülakatçıyı etkilemek için bu soruları sorabilirsin:
                        </div>
                        <ul className="space-y-3">
                            {prep.reverseInterviewQuestions.map((q, i) => (
                                <li key={i} className="flex gap-3 bg-red-50 p-3 rounded-md border border-red-100">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                        {i + 1}
                                    </span>
                                    <span className="text-slate-700 font-medium">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    )
}
