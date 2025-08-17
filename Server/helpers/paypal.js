const { Client, Environment, LogLevel } = require('@paypal/paypal-server-sdk');

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment: Environment.Sandbox, // or Environment.Production as needed
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true }
  },
  timeout: 0 // default—adjust if needed
});


module.exports = client