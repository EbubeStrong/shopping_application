const express = require("express");
const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth/auth-routes.js");

const adminProductsRouter = require("./routes/admin/products-routes.js")
const shopProductsRouter = require("./routes/shop/product-routes.js")
const shopCartRouter = require("./routes/shop/cart-routes.js")

mongoose
  .connect(
    "mongodb+srv://ebubesammy567:Satara4naga2ba5ba2@shopping-application.2exaq.mongodb.net/"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5000"],
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
app.use("/api/shop/products", shopProductsRouter)
app.use("/api/shop/cart", shopCartRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
