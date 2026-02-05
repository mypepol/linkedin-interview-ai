import OpenAI from 'openai';
import { CompanyData, InterviewPrepData } from '@/types';

const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    return new OpenAI({
        apiKey: apiKey,
    });
};

export async function generateInterviewPrep(company: CompanyData): Promise<InterviewPrepData> {
    const openai = getOpenAIClient();

    const systemPrompt = `
Sen uzman bir İK danışmanısın ve kariyer koçusun. Görevin, verilen şirket verilerini analiz ederek, bu şirkette iş görüşmesine girecek bir aday için nokta atışı, stratejik ve etkileyici bir mülakat hazırlık raporu oluşturmaktır.

Çıktıyı SADECE aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme.
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
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4-turbo-preview", // Or gpt-3.5-turbo-0125 if cheaper/faster preference, but user asked for quality
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error("OpenAI returned empty content");
        }

        const result = JSON.parse(content) as InterviewPrepData;
        return result;
    } catch (error) {
        console.error("OpenAI analysis error:", error);
        // Return mock data in case of error to prevent app crash, 
        // or rethrow if we want to show error to user. 
        // For MVP, rethrowing to show error is better.
        throw error;
    }
}
