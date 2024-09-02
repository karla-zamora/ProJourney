import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with anon key for public operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  try {
    const { email, ideas } = await req.json(); // Use req.json() to parse body in Next.js API routes

    // Insert or update the waitlist record with inserted_at set to current timestamp on insert
    const { data, error } = await supabase.from("Waitlist").upsert(
      [
        {
          email,
          ideas,
          inserted_at: new Date().toISOString(), // Set current timestamp
        },
      ],
      {
        onConflict: ["email"], // Conflict on email field
        ignoreDuplicates: false, // Allow updates if there's a conflict
      }
    );

    if (error) {
      console.error("Error upserting waitlist entry: ", error);
      return NextResponse.json(
        { error: "Failed to submit to the waitlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Successfully added to waitlist" });
  } catch (error) {
    console.error("Error submitting form: ", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
