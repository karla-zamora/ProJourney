import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Function to verify webhook signature
function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload, "utf8");
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(digest, "hex")
  );
}

export async function POST(req) {
  console.log("Webhook received from Lemon Squeezy");

  try {
    console.log("Processing webhook");
    console.log("Getting Lemon Squeezy signature");
    // Retrieve the Lemon Squeezy signature from headers
    const signature = req.headers.get("X-Signature");
    const body = await req.text(); // Get the raw text body for verification
    const signing_secret = process.env.LEMON_SQUEEZY_SIGNING_SECRET;

    // Verify the signature
    const isVerified = verifySignature(body, signature, signing_secret);

    if (!isVerified) {
      console.error("Invalid signature: Request not from Lemon Squeezy");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }
    // Signature is valid, proceed with processing the webhook
    console.log("Signature verified");

    // Parse the body as JSON after verifying the signature
    const parsedBody = JSON.parse(body);
    console.log("Body: ", parsedBody);

    const subscription_status = parsedBody.data.attributes.status;
    const customer_id = parsedBody.data.attributes.customer_id;
    const product_id = parsedBody.data.attributes.product_id;
    const variant_id = parsedBody.data.attributes.variant_id;
    const user_email = parsedBody.data.attributes.user_email;

    // Check if the user exists in the in supabase postgres database
    const { data, error, status } = await supabase
      .from("Users")
      .select("*")
      .eq("email", user_email)
      .single();

    if (error) {
      // Differentiate between user not found and actual errors
      if (status == 406) {
        console.log("User not found in the database");
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      } else {
        // Other errors, such as database connectivity or permission issues
        console.error("Error fetching user: ", error);
        return NextResponse.json(
          { message: "Error fetching user" },
          { status: 404 }
        );
      }
    }

    console.log("User data: ", data);

    // Update the user's subscription status, customer id, product id, and variant id in the database
    const { data: updateData, error: updateError } = await supabase
      .from("Users")
      .update({
        status: subscription_status,
        customer_id: customer_id,
        product_id: product_id,
        variant_id: variant_id,
      })
      .eq("email", user_email);

    // Check for errors during the update operation
    if (updateError) {
      console.error("Error updating user: ", updateError);
      return NextResponse.json(
        { message: "Error updating user" },
        { status: 500 }
      );
    }
    // log the updated user data
    console.log("User updated successfully: ", updateData);
    // Return a success response
    return NextResponse.json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Error during webhook processing: ", error);
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
}
