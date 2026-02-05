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
    visionSummary: string;
    cultureAnalysis: string;
    roleSpecificQuestions: string[];
    keyPeople: { name: string; title: string }[];
    cvAnalysis?: {
        matchScore: number;
        missingKeywords: string[];
        strengths: string[];
        recommendations: string[];
    };
    // Keeping backward compatibility or general questions if needed
    behavioralQuestions: string[];
    reverseInterviewQuestions: string[];
}

export interface AnalysisResult {
    company: CompanyData;
    prep: InterviewPrepData;
}
