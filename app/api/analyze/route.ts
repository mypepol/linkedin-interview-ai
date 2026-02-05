import { NextRequest, NextResponse } from 'next/server';
import { scrapeLinkedInCompany } from '@/lib/apify';
import { generateInterviewPrep } from '@/lib/openai';

export const maxDuration = 60; // Set max duration for Vercel/Next.js (scraping can take time)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'Geçerli bir LinkedIn şirket URL\'si gereklidir.' },
                { status: 400 }
            );
        }

        if (!url.includes('linkedin.com/company/')) {
            return NextResponse.json(
                { error: 'Lütfen geçerli bir LinkedIn şirket profili linki girin (örn: linkedin.com/company/google).' },
                { status: 400 }
            );
        }

        // Step 1: Scrape Data
        console.log(`Analyzing: ${url}`);
        const companyData = await scrapeLinkedInCompany(url);

        if (!companyData) {
            return NextResponse.json(
                { error: 'Şirket bulunamadı veya veriler çekilemedi. Lütfen URL\'yi kontrol edip tekrar deneyin.' },
                { status: 404 }
            );
        }

        // Step 2: Generate Analysis
        console.log(`Generating prep for: ${companyData.name}`);
        const prepData = await generateInterviewPrep(companyData);

        return NextResponse.json({
            company: companyData,
            prep: prepData
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
            { status: 500 }
        );
    }
}
