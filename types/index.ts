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
    behavioralQuestions: string[];
    technicalQuestions: string[];
    reverseInterviewQuestions: string[];
}

export interface AnalysisResult {
    company: CompanyData;
    prep: InterviewPrepData;
}
