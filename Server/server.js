const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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
    process.env.MONGODB_URI 
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT;

// app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
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