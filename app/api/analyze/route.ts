import { NextRequest, NextResponse } from 'next/server';
import { scrapeLinkedInCompany, searchExecutives } from '@/lib/apify';
import { generateMasterAnalysis } from '@/lib/anthropic';
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
            }
        }

        // Parallel Step 1: Scrape Company & Search Executives
        const companyPromise = scrapeLinkedInCompany(url);

        // Use a temp company name derived from URL for initial search or wait for scraper? 
        // Better: Wait for scraper to get exact name, OR use URL slug.
        // Let's scrape first to get the accurate company name for Google Search.
        console.log("Step 1: Scraping Company...");
        const companyData = await companyPromise;

        if (!companyData) {
            return NextResponse.json({ error: 'Company not found.' }, { status: 404 });
        }

        // Step 2: Search Executives (using company name)
        let executivesRaw = [];
        try {
            console.log("Step 2: Searching Executives for", companyData.name);
            executivesRaw = await searchExecutives(companyData.name);
        } catch (e) {
            console.warn("Executive search failed, proceeding without it.", e);
        }

        // Step 3: Generate Master Analysis (V3)
        console.log("Step 3: Generating Master Analysis...");
        const prepData = await generateMasterAnalysis(companyData, position, cvText, executivesRaw);

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
