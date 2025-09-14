import { getAllUsers } from "@/app/lib/db/Services/users";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await getAllUsers();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("GET /api/users failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
