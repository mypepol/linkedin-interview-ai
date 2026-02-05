import Anthropic from '@anthropic-ai/sdk';
import { CompanyData, InterviewPrepData } from '@/types';

const getAnthropicClient = () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
    }
    return new Anthropic({
        apiKey: apiKey,
    });
};

export async function generateInterviewPrep(company: CompanyData): Promise<InterviewPrepData> {
    const anthropic = getAnthropicClient();

    // We ask Claude to output strictly standard JSON.
    const systemPrompt = `
Sen uzman bir İK danışmanısın ve kariyer koçusun. Görevin, verilen şirket verilerini analiz ederek, bu şirkette iş görüşmesine girecek bir aday için nokta atışı, stratejik ve etkileyici bir mülakat hazırlık raporu oluşturmaktır.

Çıktıyı SADECE aşağıdaki JSON formatında ver. Başka hiçbir giriş/gelişme metni ekleme. JSON valid olmalı.

{
  "visionSummary": "Şirketin vizyonunu ve amacını özetleyen tek bir çarpıcı cümle.",
  "cultureAnalysis": "Şirketin kültürünü (resmi, startup, inovatif, insan odaklı vb.) analiz eden kısa bir paragraf.",
  "behavioralQuestions": ["Soru 1", "Soru 2", "Soru 3", "Soru 4", "Soru 5"],
  "technicalQuestions": ["Şirketin sektörüne veya teknolojilerine özel Soru 1", "Soru 2", "Soru 3"],
  "reverseInterviewQuestions": ["Adayın mülakatçıyı etkilemek için sorabileceği Soru 1", "Soru 2", "Soru 3"]
}

Yanıtın dili Türkçe olmalıdır.
`;

    const userPrompt = `
Şirket Bilgileri:
Ad: ${company.name}
Sektör: ${company.industry}
Hakkında: ${company.description}
Uzmanlık Alanları: ${company.specialties.join(', ')}
Çalışan Sayısı: ${company.employeeCount}
`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620", // or "claude-3-opus-20240229"
            max_tokens: 2000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                { role: "user", content: userPrompt }
            ],
        });

        const contentBlock = msg.content[0];
        if (contentBlock.type !== 'text') {
            throw new Error("Unexpected response type from Claude");
        }

        const jsonString = contentBlock.text;

        // Sometimes models add markdown code blocks, strip them if present
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

        const result = JSON.parse(cleanJson) as InterviewPrepData;
        return result;

    } catch (error) {
        console.error("Anthropic analysis error:", error);
        throw error;
    }
}
