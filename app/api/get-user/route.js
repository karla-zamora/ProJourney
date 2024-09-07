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
  console.log("POST request to /api/get-user");
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

    const { uid } = await req.json(); // Use req.json() to parse body in Next.js API routes

    // Query the Users table to select a single entry based on the user ID
    const { data, error, status } = await supabase
      .from("Users")
      .select("*")
      .eq("id", uid) // Filter by user ID
      .single(); // Ensure only one result is returned

    if (error) {
      // Differentiate between user not found and actual errors
      if (status === 406) {
        // Supabase returns 406 for single() queries when no rows are found
        console.log("User not found in the database");
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      } else {
        // Other errors, such as database connectivity or permission issues
        console.error("Supabase fetch error: ", error);
        return NextResponse.json(
          { message: "Error fetching user data", details: error.message },
          { status: 500 }
        );
      }
    }

    // Return the user data if no errors occurred
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected server error: ", error);
    return NextResponse.json(
      { message: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
