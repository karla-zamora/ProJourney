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
  console.log("POST request to /api/get-user-submissions");

  try {
    // Extract the Firebase JWT form the request headers
    const authorization = req.headers.get("authorization");

    if (!authorization) {
      console.error("Unauthorized: No authorization header");
      return NextResponse.json(
        { message: "Unauthorized: No authorization header" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1]; // Extract the token after 'Bearer '

    if (!token) {
      console.error("Unauthorized: Invalid token format");
      return NextResponse.json(
        { message: "Unauthorized: Invalid token format" },
        { status: 401 }
      );
    }

    // Verify the Firebase JWT using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // Configure Supabase client to use the user's JWT for RLS
    configureSupabaseClient(token);

    // Get all submission from the Submissions table for the user
    const { uid } = await req.json();
    console.log("User ID:", uid);
    console.log("User ID:", decodedToken.uid);
    const {
      data: submissions,
      error,
      status,
    } = await supabase.from("Submissions").select("*").eq("user_id", uid);

    // Check if there was an error getting the submissions
    if (error) {
      console.error("Error getting user submissions");
      return NextResponse.json(
        { message: "Error getting user submissions" },
        { status: 500 }
      );
    }

    // Check if the user has any submissions
    // Check if submissions are empty
    if (submissions.length === 0) {
      console.log("No submissions found for user:", uid);
      return NextResponse.json(
        { message: "No submissions found for user", submissions: [] },
        { status: 200 }
      );
    }

    console.log("Submissions:", submissions);
    console.log("Success getting user submissions");
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error getting user submissions");
    return NextResponse.json(
      { message: "Error getting user submissions" },
      { status: 500 }
    );
  }
}
