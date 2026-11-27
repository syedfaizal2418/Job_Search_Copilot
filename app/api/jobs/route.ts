import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.jobApplication.findMany({
      include: {
        aiKit: true,
      },
      orderBy: [
        { column: "asc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Helper to deserialize JSON fields in aiKit
    const formattedJobs = jobs.map((job) => {
      if (!job.aiKit) return job;
      return {
        ...job,
        aiKit: {
          ...job.aiKit,
          rewrittenBullets: job.aiKit.rewrittenBullets ? JSON.parse(job.aiKit.rewrittenBullets) : [],
          interviewQuestions: job.aiKit.interviewQuestions ? JSON.parse(job.aiKit.interviewQuestions) : [],
          essentialSkills: job.aiKit.essentialSkills ? JSON.parse(job.aiKit.essentialSkills) : [],
          optionalSkills: job.aiKit.optionalSkills ? JSON.parse(job.aiKit.optionalSkills) : [],
          termsExplained: job.aiKit.termsExplained ? JSON.parse(job.aiKit.termsExplained) : [],
          matchedKeywords: job.aiKit.matchedKeywords ? JSON.parse(job.aiKit.matchedKeywords) : [],
          missingKeywords: job.aiKit.missingKeywords ? JSON.parse(job.aiKit.missingKeywords) : [],
          formattingIssues: job.aiKit.formattingIssues ? JSON.parse(job.aiKit.formattingIssues) : [],
        },
      };
    });

    return NextResponse.json(formattedJobs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load jobs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, title, location, jobUrl, salaryRange, jobDescription, column } = body;

    if (!company || !title || !jobDescription) {
      return NextResponse.json(
        { error: "Company, Job Title, and Job Description are required." },
        { status: 400 }
      );
    }

    // Determine the next order index in this column
    const highestOrderJob = await prisma.jobApplication.findFirst({
      where: { column: column || "WISHLIST" },
      orderBy: { order: "desc" },
    });
    const nextOrder = highestOrderJob ? highestOrderJob.order + 1 : 0;

    const newJob = await prisma.jobApplication.create({
      data: {
        company: company.trim(),
        title: title.trim(),
        location: location ? location.trim() : null,
        jobUrl: jobUrl ? jobUrl.trim() : null,
        salaryRange: salaryRange ? salaryRange.trim() : null,
        jobDescription: jobDescription.trim(),
        column: column || "WISHLIST",
        order: nextOrder,
      },
      include: {
        aiKit: true,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

