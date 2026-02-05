import { ApifyClient } from 'apify-client';
import { CompanyData } from '@/types';

const getApifyClient = () => {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) {
        throw new Error("APIFY_API_TOKEN is not set in environment variables");
    }
    return new ApifyClient({
        token: token,
    });
};

export async function scrapeLinkedInCompany(url: string): Promise<CompanyData | null> {
    try {
        const client = getApifyClient();

        // Using epctex/linkedin-company-scraper
        // Input parameters typically require startUrls
        const runInput = {
            startUrls: [{ url }],
            maxConcurrency: 1,
            minConcurrency: 1,
            maxRequestRetries: 2,
        };

        console.log("Starting Apify actor for URL:", url);

        // Run the actor and wait for it to finish
        const run = await client.actor("artificially/linkedin-company-scraper").call(runInput);

        console.log("Actor finished, fetching results from dataset:", run.defaultDatasetId);

        // Fetch results from the dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) {
            console.warn("No items returned from Apify");
            return null;
        }

        const item = items[0] as any;

        // Map the raw result to our CompanyData interface
        const companyData: CompanyData = {
            name: item.name || item.title || "Unknown Company",
            description: item.description || item.about || "No description available.",
            industry: item.industry || item.companyIndustry || "Unknown Industry",
            website: item.websiteUrl || item.website || "",
            employeeCount: item.employeeCount || item.employees || "Unknown",
            specialties: item.specialties || [],
            logoUrl: item.logoUrl || item.logo || undefined,
            linkedinUrl: url,
        };

        return companyData;
    } catch (error) {
        console.error("Apify scraping error:", error);
        throw error;
    }
}
