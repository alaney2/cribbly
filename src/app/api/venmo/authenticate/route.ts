import { NextResponse } from "next/server";
import { VenmoClient } from "@/utils/venmo/client";

export async function GET() {
  try {
    const integuruToken = process.env["INTEGURU_SECRET"];
    if (!integuruToken) {
      return NextResponse.json(
        { error: "Integuru token not configured" },
        { status: 500 }
      );
    }

    const venmoClient = new VenmoClient(integuruToken);
    const balance = await venmoClient.getBalance();

    return NextResponse.json({ success: true, balance });
  } catch (error: any) {
    console.error("Venmo authentication error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to authenticate with Venmo" },
      { status: 500 }
    );
  }
}
