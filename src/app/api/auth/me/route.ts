import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("paypilot_session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      return NextResponse.json({ user: decoded });
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
