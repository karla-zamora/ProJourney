import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

// Set up the SDK with your API key
const lemonClient = lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY,
  onError: (error) => console.error("Error with Lemon Squeezy API"),
});

export default lemonClient;
