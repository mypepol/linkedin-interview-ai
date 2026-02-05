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

export async function generateInterviewPrep(company: CompanyData, targetPosition?: string, cvText?: string): Promise<InterviewPrepData> {
    const anthropic = getAnthropicClient();

    const systemPrompt = `
Sen uzman bir kariyer koçu ve üst düzey İK danışmanısın. Görevin, aday için başvurduğu pozisyona ve (varsa) CV'sine göre kişiselleştirilmiş bir mülakat stratejisi oluşturmaktır.

Çıktıyı SADECE aşağıdaki JSON formatında ver. Başka metin ekleme.

{
  "visionSummary": "Şirket vizyonu özeti",
  "cultureAnalysis": "Kültür analizi",
  "roleSpecificQuestions": ["Bu pozisyon ve sektör için 5 adet teknik/stratejik soru"],
  "behavioralQuestions": ["5 adet davranışsal soru"],
  "keyPeople": [{"name": "Ad Soyad", "title": "Unvan"}],
  "reverseInterviewQuestions": ["Adayın sorabileceği 3 soru"],
  "cvAnalysis": {  // Sadece CV verildiyse doldur, yoksa null yap
    "matchScore": 75, // 0-100 arası uyum puanı
    "missingKeywords": ["Eksik yetenek 1", "Eksik yetenek 2"],
    "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
    "recommendations": ["Tavsiye 1", "Tavsiye 2"]
  }
}
`;

    let userPrompt = `
Şirket: ${company.name}
Sektör: ${company.industry}
Açıklama: ${company.description}
Uzmanlıklar: ${company.specialties.join(', ')}
Çalışan Sayısı: ${company.employeeCount}
`;

    if (targetPosition) {
        userPrompt += `\nBaşvurulan Pozisyon: ${targetPosition}`;
    }

    if (cvText) {
        userPrompt += `\n\nAday CV Özeti:\n${cvText.substring(0, 10000)}`;
    } else {
        userPrompt += `\n\n(CV verilmedi, sadece şirket ve pozisyona göre genel analiz yap)`;
    }

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4000,
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

        const cleanJson = contentBlock.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson) as InterviewPrepData;

    } catch (error) {
        console.error("Anthropic analysis error:", error);
        throw error;
    }
}
