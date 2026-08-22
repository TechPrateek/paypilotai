import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { caseNoteSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;
    const body = await req.json();

    const validatedData = caseNoteSchema.parse(body);

    const note = await prisma.caseNote.create({
      data: {
        content: validatedData.content,
        caseId: id,
        authorId: session.user.id,
      },
      include: {
        author: true,
      }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error creating case note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 400 }
    );
  }
}
