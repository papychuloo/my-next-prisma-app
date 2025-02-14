import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({ message: "Hello from NextAuth API" });
}

export async function POST(req: Request) {
  return NextResponse.json({ message: "POST request received" });
}
