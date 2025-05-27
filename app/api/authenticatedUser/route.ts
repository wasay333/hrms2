import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../actions/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
