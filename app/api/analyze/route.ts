import { NextRequest, NextResponse } from 'next/server';
import { scrapeLinkedInCompany } from '@/lib/apify';
import { generateInterviewPrep } from '@/lib/anthropic';
// @ts-ignore
const pdf = require('pdf-parse');

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const url = formData.get('url') as string;
        const position = formData.get('position') as string | undefined;
        const file = formData.get('file') as File | null;

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'Valid LinkedIn URL required.' }, { status: 400 });
        }

        let cvText = '';
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const data = await pdf(buffer);
                cvText = data.text;
            } catch (e) {
                console.error("PDF Parsing failed", e);
                // Continue without CV if parsing fails, but maybe warn?
            }
        }

        // Step 1: Scrape
        const companyData = await scrapeLinkedInCompany(url);

        if (!companyData) {
            return NextResponse.json({ error: 'Company not found.' }, { status: 404 });
        }

        // Step 2: Generate Analysis (V2)
        const prepData = await generateInterviewPrep(companyData, position, cvText);

        return NextResponse.json({
            company: companyData,
            prep: prepData
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
