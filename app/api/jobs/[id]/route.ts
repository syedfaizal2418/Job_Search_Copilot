import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedJob = await prisma.jobApplication.update({
      where: { id },
      data: {
        ...(body.column !== undefined && { column: body.column }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.company !== undefined && { company: body.company }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.jobUrl !== undefined && { jobUrl: body.jobUrl }),
        ...(body.salaryRange !== undefined && { salaryRange: body.salaryRange }),
        ...(body.jobDescription !== undefined && { jobDescription: body.jobDescription }),
      },
      include: {
        aiKit: true,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.jobApplication.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

