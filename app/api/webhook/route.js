import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("Webhook received");
  const body = await req.json();
  console.log(body);
  return NextResponse.json({ message: "Webhook received" });
}
