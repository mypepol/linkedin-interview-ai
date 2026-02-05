export interface CompanyData {
    name: string;
    description: string;
    industry: string;
    website: string;
    employeeCount: number | string;
    specialties: string[];
    logoUrl?: string;
    linkedinUrl: string;
}

export interface InterviewPrepData {
    companyCulture: string;
    generalQuestions: string[];
    executiveTeam: {
        name: string;
        title: string;
        predictedEmail?: string;
        linkedin?: string;
    }[];
    cvMatchScore: number;
    cvDeepDive: {
        trigger: string;
        question: string;
        starAnswer: string;
    }[];
    // Legacy fields for backward compatibility if needed, but prefer V3 structure
    visionSummary?: string;
    cultureAnalysis?: string;
    roleSpecificQuestions?: string[];
    reverseInterviewQuestions?: string[];
}

export interface AnalysisResult {
    company: CompanyData;
    prep: InterviewPrepData;
}
