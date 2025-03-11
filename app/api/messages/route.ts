import { NextResponse } from "next/server";
import prisma from "@/lib/prismaClient";

export async function GET() {
  const messages = await prisma.message.findMany({
    include: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const { text, userId } = await request.json();
  const newMessage = await prisma.message.create({
    data: {
      text,
      userId,
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json(newMessage);
}
