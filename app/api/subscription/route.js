import lemonClient from "@/lib/lemonClient";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
  } catch (error) {
    console.error("Error creating checkout session: ", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
