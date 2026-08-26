import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { STATUS_ORDER } from "@/app/data/status-data";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    const { postId } = await params;
    const numericPostId = Number(postId);

    if (Number.isNaN(numericPostId)) {
      return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
    }

    // Validate status
    if (!STATUS_ORDER.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: numericPostId },
      data: {
        status,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post status:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}