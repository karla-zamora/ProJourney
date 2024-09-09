import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Parse Firebase Admin SDK service account from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Function to configure Supabase client with custom fetch for authorization
function configureSupabaseClient(token) {
  supabase.auth.setSession({ access_token: token }); // Setting the session token
}

export async function POST(req) {
  console.log("POST request to /api/submit-algorithm-pass");
  try {
    // Extract the Firebase JWT form the request headers
    const authorization = req.headers.get("authorization"); // Always use lowercase

    if (!authorization) {
      return NextResponse.json(
        { message: "Unauthorized: No authorization header" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1]; // Extract the token after 'Bearer '
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token format" },
        { status: 401 }
      );
    }

    // Verify the Firebase JWT using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // Configure Supabase client to use the user's JWT for RLS
    configureSupabaseClient(token);

    const {
      problemName,
      passed,
      geminiOutput,
      code_submission,
      coding_score,
      problem_solving_score,
      understanding_score,
      strengths,
      needs_work,
    } = await req.json(); // Use req.json() to parse body in Next.js API routes

    // get algorithm id from problemName
    const { data: algorithmData, error: algorithmError } = await supabase
      .from("Algorithms")
      .select("*")
      .eq("question", problemName)
      .single();

    if (algorithmError) {
      console.error("Error fetching algorithm", algorithmError);
      return NextResponse.error({
        status: 500,
        body: "Internal Server Error",
      });
    }
    const algorithm_id = algorithmData.id;
    // Insert a new submission into the Submissions table
    const { data, error } = await supabase.from("Submissions").insert([
      {
        user_id: decodedToken.uid,
        agorithm_id: algorithm_id,
        passed,
        code_submission,
        coding_score,
        problem_solving_score,
        understanding_score,
        strengths,
        needs_work,
        submitted_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error submitting algorithm pass", error);
      return NextResponse.error({
        status: 500,
        body: "Internal Server Error",
      });
    }

    console.log("Successfully submitted algorithm pass");
    return NextResponse.json({
      message: "Successfully submitted algorithm pass",
    });
  } catch (error) {
    console.error("Error in /api/submit-algorithm-pass", error);
    return NextResponse.error({
      status: 500,
      body: "Internal Server Error",
    });
  }
}
