import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiKitWithOpenRouter } from "@/lib/openrouter";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const job = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: "Job application not found." }, { status: 404 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: "default-user" },
    });

    // Invoke OpenRouter engine
    const aiResult = await generateAiKitWithOpenRouter({
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.jobDescription,
      masterResumeText: profile?.masterResumeText,
      targetRole: profile?.targetRole,
      preferredTone: profile?.preferredTone,
    });

    // Upsert into AiKit table
    const savedAiKit = await prisma.aiKit.upsert({
      where: { jobId: id },
      create: {
        jobId: id,
        coverLetter: aiResult.coverLetter || "",
        rewrittenBullets: JSON.stringify(aiResult.rewrittenBullets || []),
        interviewQuestions: JSON.stringify(aiResult.interviewQuestions || []),
        companyBrief: aiResult.companyBrief || "",
        simplifiedSummary: aiResult.simplifiedSummary || "",
        essentialSkills: JSON.stringify(aiResult.essentialSkills || []),
        optionalSkills: JSON.stringify(aiResult.optionalSkills || []),
        termsExplained: JSON.stringify(aiResult.termsExplained || []),
        atsScore: aiResult.atsScore ?? 75,
        matchedKeywords: JSON.stringify(aiResult.matchedKeywords || []),
        missingKeywords: JSON.stringify(aiResult.missingKeywords || []),
        formattingIssues: JSON.stringify(aiResult.formattingIssues || []),
        atsRecommendations: aiResult.atsRecommendations || "",
      },
      update: {
        coverLetter: aiResult.coverLetter || "",
        rewrittenBullets: JSON.stringify(aiResult.rewrittenBullets || []),
        interviewQuestions: JSON.stringify(aiResult.interviewQuestions || []),
        companyBrief: aiResult.companyBrief || "",
        simplifiedSummary: aiResult.simplifiedSummary || "",
        essentialSkills: JSON.stringify(aiResult.essentialSkills || []),
        optionalSkills: JSON.stringify(aiResult.optionalSkills || []),
        termsExplained: JSON.stringify(aiResult.termsExplained || []),
        atsScore: aiResult.atsScore ?? 75,
        matchedKeywords: JSON.stringify(aiResult.matchedKeywords || []),
        missingKeywords: JSON.stringify(aiResult.missingKeywords || []),
        formattingIssues: JSON.stringify(aiResult.formattingIssues || []),
        atsRecommendations: aiResult.atsRecommendations || "",
        generatedAt: new Date(),
      },
    });

    return NextResponse.json({
      ...savedAiKit,
      rewrittenBullets: aiResult.rewrittenBullets,
      interviewQuestions: aiResult.interviewQuestions,
      essentialSkills: aiResult.essentialSkills,
      optionalSkills: aiResult.optionalSkills,
      termsExplained: aiResult.termsExplained,
      matchedKeywords: aiResult.matchedKeywords,
      missingKeywords: aiResult.missingKeywords,
      formattingIssues: aiResult.formattingIssues,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI Kit Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

