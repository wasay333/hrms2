import { NextRequest, NextResponse } from "next/server";
import { inviteEmployee } from "../../../actions/employee/creation";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await inviteEmployee(data);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
