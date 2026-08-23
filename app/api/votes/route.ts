import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        {
          error: "Post Id is required",
        },
        { status: 400 }
      );
    }

    // Check if vote already exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
      return NextResponse.json({ voted: false });
    } else {
      // Add vote (toggle)
      await prisma.vote.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
      return NextResponse.json({ voted: true });
    }
  } catch (error) {
    console.error("Error toggling vote:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}