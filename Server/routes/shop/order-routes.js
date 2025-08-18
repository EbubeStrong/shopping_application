const express = require("express");

const {
 createOrder,
 captureOrder
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder)
router.post("/capture/:orderId", captureOrder)

module.exports = router;
