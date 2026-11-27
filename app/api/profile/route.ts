import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let profile = await prisma.userProfile.findUnique({
      where: { id: "default-user" },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: "default-user",
          fullName: "",
          targetRole: "",
          masterResumeText: "",
          preferredTone: "professional",
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, targetRole, masterResumeText, preferredTone } = body;

    const profile = await prisma.userProfile.upsert({
      where: { id: "default-user" },
      update: {
        fullName: fullName ?? null,
        targetRole: targetRole ?? null,
        masterResumeText: masterResumeText ?? null,
        preferredTone: preferredTone ?? "professional",
      },
      create: {
        id: "default-user",
        fullName: fullName ?? null,
        targetRole: targetRole ?? null,
        masterResumeText: masterResumeText ?? null,
        preferredTone: preferredTone ?? "professional",
      },
    });

    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

