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
  console.log("POST request to /api/create-user");
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

    const { uid, email, name, status, customer_id, product_id, variant_id } =
      await req.json(); // Use req.json() to parse body in Next.js API routes

    // Insert a new user into the Users table
    const { data, error } = await supabase.from("Users").insert([
      {
        id: uid,
        email,
        name,
        status,
        customer_id,
        product_id,
        variant_id,
      },
    ]);

    if (error) {
      console.error("Error creating user");
      return NextResponse.json(
        { message: "Error creating user" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating user");
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
