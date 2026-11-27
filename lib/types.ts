export type PipelineColumn =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED";

export interface InterviewQuestionItem {
  question: string;
  rationale: string;
  recommendedAnswerStrategy: string;
}

export interface TermExplanationItem {
  term: string;
  explanation: string;
}

export interface AiKitData {
  id?: string;
  jobId: string;
  coverLetter?: string | null;
  rewrittenBullets?: string[] | null;
  interviewQuestions?: InterviewQuestionItem[] | null;
  companyBrief?: string | null;
  simplifiedSummary?: string | null;
  essentialSkills?: string[] | null;
  optionalSkills?: string[] | null;
  termsExplained?: TermExplanationItem[] | null;
  atsScore?: number | null;
  matchedKeywords?: string[] | null;
  missingKeywords?: string[] | null;
  formattingIssues?: string[] | null;
  atsRecommendations?: string | null;
  generatedAt?: string | Date;
}

export interface JobCardData {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  jobUrl?: string | null;
  salaryRange?: string | null;
  jobDescription: string;
  column: PipelineColumn;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  aiKit?: AiKitData | null;
}

export interface UserProfileData {
  id: string;
  fullName?: string | null;
  targetRole?: string | null;
  masterResumeText?: string | null;
  preferredTone: string;
  updatedAt: string | Date;
}

