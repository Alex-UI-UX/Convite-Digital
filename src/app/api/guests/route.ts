import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Guest from "@/models/Guest";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const guests = await Guest.find().sort({ criadoEm: -1 });
  return Response.json(guests);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();

  const { nome, status, acompanhantes } = body;

  if (!nome || !status) {
    return Response.json(
      { error: "Nome e status são obrigatórios" },
      { status: 400 }
    );
  }

  const guest = await Guest.create({
    nome,
    status,
    acompanhantes: acompanhantes || [],
  });

  return Response.json(guest, { status: 201 });
}
