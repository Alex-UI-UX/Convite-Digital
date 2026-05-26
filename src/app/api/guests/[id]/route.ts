import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Guest from "@/models/Guest";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;
  const deleted = await Guest.findByIdAndDelete(id);

  if (!deleted) {
    return Response.json({ error: "Convidado não encontrado" }, { status: 404 });
  }

  return Response.json({ success: true });
}
