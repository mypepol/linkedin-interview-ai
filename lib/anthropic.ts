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

export async function generateMasterAnalysis(
    company: CompanyData,
    targetPosition?: string,
    cvText?: string,
    executiveSearchResults?: any[]
): Promise<InterviewPrepData> {
    const anthropic = getAnthropicClient();

    const systemPrompt = `
Sen Dünyanın En İyi Kariyer Koçu ve Yönetici İşe Alım Uzmanısın.
Görevin, aşağıdaki verileri birleştirerek adaya "Mülakatı Kazandıran" stratejik bir rapor hazırlamaktır.

ELDELİ VERİLER:
1. Şirket Profili (Sektör, Vizyon, Çalışanlar)
2. Adayın Başvurduğu Pozisyon
3. Adayın CV Özeti
4. Google/LinkedIn aramasından gelen "Yönetici Adayları" (Ham veri)

YAPMAN GEREKENLER:
1. **Yönetici Analizi:** Google sonuçlarından CEO, CTO, Head of HR gibi kilit isimleri ayıkla. Eğer isimden tahmin edebiliyorsan şirket domainine (örn: @google.com) uygun email tahmin et.
2. **Derin CV Analizi:** CV'deki spesifik bir cümleyi "Trigger" olarak al ve buna istinaden gelebilecek zor bir soru üret. Ardından buna STAR (Situation, Task, Action, Result) tekniğiyle ideal bir cevap yaz.
3. **Kültür & Strateji:** Şirketin "About" metninden yola çıkarak iç kültürünü analiz et.

ÇIKTI FORMATI (SADECE JSON):
{
  "companyCulture": "Şirketin ruhunu anlatan 1-2 cümle. Örn: 'Hızlı büyüyen, inisiyatif almayı seven...'",
  "generalQuestions": ["Genel kültür/davranış sorusu 1", "Soru 2", "Soru 3"],
  "executiveTeam": [
    { "name": "Ad Soyad", "title": "Unvan", "predictedEmail": "tahmini@sirket.com (opsiyonel)", "linkedin": "LinkedIn URL (varsa)" }
  ],
  "cvMatchScore": 85, // 0-100
  "cvDeepDive": [
     {
       "trigger": "CV'nizde geçen 'X projesinde %50 verim artışı' ifadesi...",
       "question": "Bu projede karşılaştığınız en büyük teknik engel neydi ve nasıl aştınız?",
       "starAnswer": "Situation: X projesinde... Task: Verimi artırmam gerekiyordu... Action: Şu teknolojiyi kullandım... Result: %50 artış sağlandı."
     },
     { "trigger": "...", "question": "...", "starAnswer": "..." } // En az 3 adet
  ]
}
`;

    let userPrompt = `
ŞİRKET: ${company.name}
SEKTÖR: ${company.industry}
AÇIKLAMA: ${company.description}

POZİSYON: ${targetPosition || "Belirtilmedi"}

HAM YÖNETİCİ ARAMA SONUÇLARI (Buradan anlamlı isimleri çıkar):
${JSON.stringify(executiveSearchResults || []).substring(0, 3000)}

ADAY CV (ÖZET):
${cvText ? cvText.substring(0, 15000) : "CV Yok"}
`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4000,
            temperature: 0.5,
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
        console.error("Master Analysis Error:", error);
        throw error;
    }
}
