import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  let event = await Event.findOne();
  if (!event) {
    event = await Event.create({});
  }
  return Response.json(event);
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const body = await request.json();

  let event = await Event.findOne();
  if (!event) {
    event = await Event.create(body);
  } else {
    Object.assign(event, body);
    await event.save();
  }

  return Response.json(event);
}
