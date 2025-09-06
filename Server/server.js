const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Load env before importing routes/controllers that may read env on require
dotenv.config();

const authRouter = require("./routes/auth/auth-routes.js");
const adminProductsRouter = require("./routes/admin/products-routes.js")
const adminOrderRouter = require("./routes/admin/order-routes.js")

const shopProductsRouter = require("./routes/shop/product-routes.js")
const shopCartRouter = require("./routes/shop/cart-routes.js")
const shopAddressRouter = require("./routes/shop/address-routes.js")
const shopOrderRouter = require("./routes/shop/order-routes.js")
const shopSearchRouter = require("./routes/shop/search-routes.js")
const shopReviewRouter = require("./routes/shop/review-routes.js")

const commonFeatureRouter = require("./routes/common/feature-routes.js")

mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://ebubesammy567:Satara4naga2ba5ba2@shopping-application.2exaq.mongodb.net/"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter)
app.use("/api/admin/products", adminProductsRouter)
app.use("/api/admin/orders", adminOrderRouter)


app.use("/api/shop/products", shopProductsRouter)
app.use("/api/shop/cart", shopCartRouter)
app.use("/api/shop/address", shopAddressRouter)
app.use("/api/shop/order", shopOrderRouter)
app.use("/api/shop/search", shopSearchRouter)
app.use("/api/shop/review", shopReviewRouter)

app.use("/api/common/feature", commonFeatureRouter)

app.get("/", (req, res) => {
  res.send("E-Commerce Application is Live ");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});









// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// // Load env before importing routes/controllers that may read env on require
// dotenv.config();

// const authRouter = require("./routes/auth/auth-routes.js");
// const adminProductsRouter = require("./routes/admin/products-routes.js")
// const shopProductsRouter = require("./routes/shop/product-routes.js")
// const shopCartRouter = require("./routes/shop/cart-routes.js")
// const shopAddressRouter = require("./routes/shop/address-routes.js")
// const shopOrderRouter = require("./routes/shop/order-routes.js")

// // MongoDB connection options
// const mongoOptions = {
//   serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds instead of 30
//   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//   maxPoolSize: 10, // Maintain up to 10 socket connections
//   minPoolSize: 1, // Maintain at least 1 socket connection
//   maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
//   retryWrites: true,
//   w: 'majority'
// };

// // Function to connect to MongoDB with retry logic
// const connectWithRetry = async () => {
//   const maxRetries = 5;
//   let retries = 0;

//   while (retries < maxRetries) {
//     try {
//       console.log(`Attempting to connect to MongoDB (attempt ${retries + 1}/${maxRetries})...`);
      
//       await mongoose.connect(
//         process.env.MONGODB_URI ||
//           "mongodb+srv://ebubesammy567:Satara4naga2ba5ba2@shopping-application.2exaq.mongodb.net/",
//         mongoOptions
//       );
      
//       console.log("✅ MongoDB Connected Successfully!");
//       break;
//     } catch (err) {
//       retries++;
//       console.error(`❌ MongoDB connection attempt ${retries} failed:`, err.message);
      
//       if (retries === maxRetries) {
//         console.error("❌ Failed to connect to MongoDB after all retry attempts");
//         console.error("Please check your internet connection and MongoDB Atlas status");
//         process.exit(1);
//       }
      
//       // Wait 5 seconds before retrying
//       console.log(`⏳ Retrying in 5 seconds...`);
//       await new Promise(resolve => setTimeout(resolve, 5000));
//     }
//   }
// };

// // Handle MongoDB connection events
// mongoose.connection.on('error', (err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('⚠️ MongoDB disconnected');
// });

// mongoose.connection.on('reconnected', () => {
//   console.log('✅ MongoDB reconnected');
// });

// // Initialize connection
// connectWithRetry();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://localhost:5000", "http://localhost:5173"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-Control",
//       "Expires",
//       "Pragma",
//     ],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use("/api/auth", authRouter);
// app.use("/api/admin/products", adminProductsRouter)
// app.use("/api/admin/products", adminProductsRouter)
// app.use("/api/shop/products", shopProductsRouter)
// app.use("/api/shop/cart", shopCartRouter)
// app.use("/api/shop/address", shopAddressRouter)
// app.use("/api/shop/order", shopOrderRouter)

// app.get("/", (req, res) => {
//   res.send("E-Commerce Application is Live ");
// });

// // Health check endpoint
// app.get("/health", (req, res) => {
//   const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
//   res.json({
//     status: "ok",
//     timestamp: new Date().toISOString(),
//     database: dbStatus,
//     uptime: process.uptime()
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
