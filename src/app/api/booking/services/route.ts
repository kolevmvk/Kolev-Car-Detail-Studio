import { NextResponse } from "next/server";
import { getServices } from "@/features/booking/actions";

// Public API endpoint for service listing.
// Used by e2e tests (allows route mocking) and could be used by future mobile clients.
// Returns the same data as the getServices() server action.
export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ services: [] }, { status: 200 });
  }
}
