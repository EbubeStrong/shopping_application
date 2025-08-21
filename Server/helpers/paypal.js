const paypal = require("@paypal/checkout-server-sdk");

// Check if environment variables are set
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("PayPal credentials are not set. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your environment variables.");
}

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;


// const paypal = require('@paypal/checkout-server-sdk');

// let clientId = process.env.PAYPAL_CLIENT_ID;
// let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// let environment =
//   process.env.NODE_ENV === "production"
//     ? new paypal.core.LiveEnvironment(clientId, clientSecret) // Real payments
//     : new paypal.core.SandboxEnvironment(clientId, clientSecret); // Test mode

// let client = new paypal.core.PayPalHttpClient(environment);

// module.exports = client;


// const paypal = require('@paypal/checkout-server-sdk');

// let clientId = process.env.PAYPAL_CLIENT_ID;
// let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// function environment() {
//   if (process.env.NODE_ENV === "production" &&  process.env.PAYPAL_MODE === "sandbox") {
//     // Live Environment
//     return new paypal.core.LiveEnvironment(clientId, clientSecret);
//   } else {
//     // Sandbox Environment
//     return new paypal.core.SandboxEnvironment(clientId, clientSecret);
//   }
// }

// function client() {
//   return new paypal.core.PayPalHttpClient(environment());
// }

// module.exports = { client };
