export const config = {
  port: process.env.PORT || 3000,
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Auth0
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  },

  // AWS S3
//   aws: {
//     region: process.env.AWS_REGION || 'us-east-1',
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     s3Bucket: process.env.AWS_S3_BUCKET,
//   },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
};
