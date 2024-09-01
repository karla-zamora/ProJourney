import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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

export async function POST(req) {
  try {
    // Extract the Firebase JWT from the request headers
    const authorization = req.headers.get('authorization'); // Always use lowercase

    if (!authorization) {
      return NextResponse.json({ message: 'Unauthorized: No authorization header' }, { status: 401 });
    }

    const token = authorization.split(' ')[1]; // Extract the token after 'Bearer '
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token format' }, { status: 401 });
    }

    // Verify the Firebase JWT using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // Extract the request body containing algorithm data
    const body = await req.json();
    const { question, answer, spaceComplexity, timeComplexity, difficulty, tags } = body;

    // Insert the algorithm into the Supabase table with the user's token in the headers
    const { data, error } = await supabase.from('Algorithms').insert([
      {
        question,
        answer,
        spaceComplexity,
        timeComplexity,
        difficulty,
        tags,
      },
    ], {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in headers for RLS policies
      }
    });

    if (error) {
      console.error('Error inserting algorithm: ', error);
      return NextResponse.json({ error: 'Failed to insert algorithm' }, { status: 500 });
    }

    return NextResponse.json({ data, message: 'Algorithm inserted successfully' });
  } catch (error) {
    console.error('Error verifying Firebase token or inserting data: ', error);
    return NextResponse.json({ error: 'Unauthorized or failed to process request' }, { status: 401 });
  }
}
