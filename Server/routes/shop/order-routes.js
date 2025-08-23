const express = require("express");

const {
 createOrder,
 capturePayment, 
 getAllOrdersByUser, 
 getAllOrderDetails
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder)
// router.post("/capture/:orderId", captureOrder)
router.post("/capture", capturePayment)

router.get("/list/:userId", getAllOrdersByUser)

router.get("/details/:id", getAllOrderDetails )

module.exports = router;
