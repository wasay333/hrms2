import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user || user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
