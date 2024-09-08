import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

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

export async function GET(req) {
  console.log("GET request to /api/get-algorithms");
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

    // Get all algorithms from the Algorithms table
    const { data: algorithms, error } = await supabase
      .from("Algorithms")
      .select("*");

    if (error) {
      console.error("Error getting algorithms");
      return NextResponse.json(
        { message: "Error getting algorithms" },
        { status: 500 }
      );
    }

    console.log("Algorithms:", algorithms);
    console.log("Success getting algorithms");
    return NextResponse.json({ algorithms });
  } catch (error) {
    console.error("Error getting algorithms");
    return NextResponse.json(
      { message: "Error getting algorithms" },
      { status: 500 }
    );
  }
}
