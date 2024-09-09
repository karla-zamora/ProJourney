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

export async function GET(req) {
  console.log("GET request to /api/get-algorithms");
  try {
    const authorization = req.headers.get("authorization");

    if (!authorization) {
      console.error("Unauthorized: No authorization header");
      return NextResponse.json(
        { message: "Unauthorized: No authorization header" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      console.error("Unauthorized: Invalid token format");
      return NextResponse.json(
        { message: "Unauthorized: Invalid token format" },
        { status: 401 }
      );
    }

    // Verify the Firebase JWT using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // Query the Supabase Algorithms table
    const { data: algorithms, error } = await supabase
      .from("Algorithms")
      .select("*");

    if (error) {
      console.error("Error getting algorithms: ", error.message);
      return NextResponse.json(
        { message: "Error getting algorithms", details: error.message },
        { status: 500 }
      );
    }

    console.log("Algorithms fetched successfully");
    return NextResponse.json({
      message: "Success getting algorithms",
      algorithms,
    });
  } catch (error) {
    console.error("Error getting algorithms: ", error.message);
    return NextResponse.json(
      { message: "Error getting algorithms", details: error.message },
      { status: 500 }
    );
  }
}
