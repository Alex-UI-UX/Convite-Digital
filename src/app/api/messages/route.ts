import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const messages = await Message.find().sort({ criadoEm: -1 });
  return Response.json(messages);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();

  const { autor, texto } = body;

  if (!autor || !texto) {
    return Response.json(
      { error: "Autor e texto são obrigatórios" },
      { status: 400 }
    );
  }

  const message = await Message.create({ autor, texto });
  return Response.json(message, { status: 201 });
}
