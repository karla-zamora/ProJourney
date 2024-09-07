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

    // Determine the event type
    const eventType = parsedBody.meta.event_name;

    // Extract common fields
    const user_email = parsedBody.data.attributes.user_email;

    // Handle different event types and corresponding object structures
    switch (eventType) {
      case "subscription_created":
        console.log("Handling subscription created event");
        // Extract relevant fields for subscription creation
        const { customer_id, product_id, variant_id } =
          parsedBody.data.attributes;

        await supabase
          .from("Users")
          .update({
            status: "active",
            customer_id: customer_id,
            product_id: product_id,
            variant_id: variant_id,
          })
          .eq("email", user_email);

        console.log("User subscription created successfully: ", user_email);
        break;

      case "subscription_payment_success":
        console.log("Handling payment successful event");
        // Update the user status to active on successful payment
        await supabase
          .from("Users")
          .update({
            status: "active",
          })
          .eq("email", user_email);

        console.log("Payment successful for user: ", user_email);
        break;

      case "subscription_payment_failed":
        console.log("Handling payment failed event");
        // Update the subscription status to reflect the payment failure
        await supabase
          .from("Users")
          .update({
            status: "payment_failed",
          })
          .eq("email", user_email);
        // Consider notifying the user about the failed payment
        console.log("Payment failed for user: ", user_email);
        break;

      case "subscription_payment_recovered":
        console.log("Handling payment recovered event");
        // Restore access and update status after a recovered payment
        await supabase
          .from("Users")
          .update({
            status: "active", // Back to active after recovery
          })
          .eq("email", user_email);

        console.log("Payment recovered for user: ", user_email);
        break;

      case "subscription_updated":
        console.log("Handling subscription updated event");
        // Reflect any updates to the subscription
        const updatedFields = {
          status: parsedBody.data.attributes.status,
          product_id: parsedBody.data.attributes.product_id,
          variant_id: parsedBody.data.attributes.variant_id,
        };

        const { data: updatedUser, error: updateError } = await supabase
          .from("Users")
          .update(updatedFields)
          .eq("email", user_email);

        if (updateError) {
          console.error("Error updating subscription: ", updateError);
          return NextResponse.json(
            { message: "Error updating subscription data" },
            { status: 500 }
          );
        }

        console.log("User subscription updated successfully: ", user_email);
        break;

      case "subscription_cancelled":
        console.log("Handling subscription cancelled event");
        await supabase
          .from("Users")
          .update({
            status: "cancelled",
          })
          .eq("email", user_email);

        console.log("User subscription cancelled: ", user_email);
        break;

      case "subscription_expired":
        console.log("Handling subscription expired event");
        await supabase
          .from("Users")
          .update({
            status: "expired",
          })
          .eq("email", user_email);
        // Fully revoke access as the subscription has ended

        console.log("User subscription expired: ", user_email);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
        return NextResponse.json(
          { message: "Event type not handled" },
          { status: 200 }
        );
    }

    // Return a success response for all handled cases
    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during webhook processing: ", error);
    return NextResponse.json({ message: "Webhook error" }, { status: 500 });
  }
}
