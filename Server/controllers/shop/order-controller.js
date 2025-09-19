const paypal = require("@paypal/checkout-server-sdk");
const paypalClient = require("../../helpers/paypal");
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/products");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,      // array of { productId, title, image, price, quantity }
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;


    const processedCartItems = cartItems.map((item) => {
  // Ensure salePrice exists and is valid
  let finalSalePrice =
    item.salePrice !== undefined && item.salePrice > 0
      ? item.salePrice
      : item.price; // fallback to regular price if not provided

  return {
    productId: item.productId,
    title: item.title,
    image: item.image,
    price: item.price,
    salePrice: finalSalePrice,
    quantity: item.quantity || 1,
  };
})

    // Calculate total for PayPal
    const itemTotal = processedCartItems
      .reduce((sum, it) => sum + Number(it.salePrice) * Number(it.quantity), 0)
      .toFixed(2);

    // Build PayPal request
    const itemsForPayPal = processedCartItems.map((item) => ({
      name: item.title,
      sku: item.productId,
      unit_amount: {
        currency_code: "USD",
        value: Number(item.salePrice).toFixed(2),
      },
      quantity: String(item.quantity),
    }));

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: itemTotal,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemTotal,
              },
            },
          },
          items: itemsForPayPal,
        },
      ],
    });

    const response = await paypalClient.execute(request);
    const result = response.result;

    // Save order to DB
    const newOrder = new Order({
      userId,
      cartItems: processedCartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: result.id, // PayPal order ID
      payerId,
      cartId,
    });
    await newOrder.save();

    const approvalURL = result.links.find((l) => l.rel === "approve")?.href;

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error while creating PayPal order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Some error occurred while creating order",
    });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { paypalOrderId, payerId, orderId } = req.body;

    console.log("=== Server Capture Payment Debug ===");
    console.log("Received parameters:", { paypalOrderId, payerId, orderId });

    // Validate required parameters
    if (!paypalOrderId || !payerId || !orderId) {
      console.log("Missing parameters validation failed");
      return res.status(400).json({
        success: false,
        message:
          "Missing required parameters: paypalOrderId, payerId, or orderId",
      });
    }

    let order = await Order.findById(orderId);
    console.log("Found order:", order ? "Yes" : "No");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Check if order is already processed
    if (order.paymentStatus === "paid" && order.orderStatus === "confirmed") {
      console.log("Order already processed");
      return res.status(200).json({
        success: true,
        message: "Order already confirmed",
        data: order,
      });
    }

    // Add a processing flag to prevent double processing
    if (order.processingPayment) {
      console.log("Order is currently being processed");
      return res.status(409).json({
        success: false,
        message: "Order is currently being processed",
      });
    }

    // Set processing flag
    order.processingPayment = true;
    await order.save();

    console.log("Attempting to capture PayPal order:", paypalOrderId);

    // ✅ Step 1: Capture payment from PayPal
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({}); // required but empty

    console.log("PayPal capture request created for order:", paypalOrderId);

    let paypalResponse;
    try {
      paypalResponse = await paypalClient.execute(request);
      console.log("PayPal response status:", paypalResponse.result?.status);
    } catch (paypalError) {
      console.error("PayPal API error:", paypalError);

      // Check if the error is because the order is already captured
      if (paypalError.statusCode === 422 && paypalError._originalError?.text) {
        try {
          const errorDetails = JSON.parse(paypalError._originalError.text);
          if (
            errorDetails.details &&
            errorDetails.details.some(
              (detail) => detail.issue === "ORDER_ALREADY_CAPTURED"
            )
          ) {
            console.log(
              "PayPal order already captured, proceeding with order update"
            );

            // Since the order is already captured, we can proceed with updating our database
            // We'll treat this as a successful capture
            paypalResponse = {
              result: {
                status: "COMPLETED",
                id: paypalOrderId,
              },
            };
          } else {
            return res.status(500).json({
              success: false,
              message: "Error communicating with PayPal",
              error: paypalError.message,
            });
          }
        } catch (parseError) {
          return res.status(500).json({
            success: false,
            message: "Error communicating with PayPal",
            error: paypalError.message,
          });
        }
      } else {
        return res.status(500).json({
          success: false,
          message: "Error communicating with PayPal",
          error: paypalError.message,
        });
      }
    }

    // Check if the order is already completed or can be completed
    if (!paypalResponse.result) {
      console.log("PayPal response has no result");
      return res.status(400).json({
        success: false,
        message: "Invalid PayPal response",
        data: paypalResponse,
      });
    }

    const paypalStatus = paypalResponse.result.status;
    console.log("PayPal order status:", paypalStatus);

    // Accept different completion states
    if (paypalStatus !== "COMPLETED" && paypalStatus !== "APPROVED") {
      console.log("PayPal capture failed - status:", paypalStatus);
      return res.status(400).json({
        success: false,
        message: `Payment not completed on PayPal. Status: ${paypalStatus}`,
        data: paypalResponse.result,
      });
    }

    console.log("PayPal capture successful, updating order");

    // ✅ Step 2: Update order in DB
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paypalOrderId; // Update the paymentId with PayPal order ID
    order.payerId = payerId;
    order.orderUpdateDate = new Date();
    order.processingPayment = false; // Clear processing flag

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    // Clear the cart if cartId exists
    if (order.cartId) {
      console.log("Clearing cart:", order.cartId);
      try {
        await Cart.findByIdAndDelete(order.cartId);
      } catch (cartError) {
        console.log("Cart already deleted or not found:", cartError.message);
      }
    }

    await order.save();
    console.log("Order updated successfully");

    res.status(200).json({
      success: true,
      message: "Order Confirmed",
      data: order,
    });
  } catch (error) {
    console.error(
      "PayPal Capture Error:",
      error.message,
      error.response?.data || error
    );

    // Clear processing flag if order exists
    if (order && order.processingPayment) {
      try {
        order.processingPayment = false;
        await order.save();
      } catch (clearError) {
        console.error("Error clearing processing flag:", clearError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Some error occurred while capturing payment",
      error: error.message,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error while getting all PayPal order:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "Some error occurred while  getting all PayPal order",
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "id")

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });


  } catch (error) {
    console.error("Error while getting all PayPal order details:", error);
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Some error occurred while  getting all PayPal order details",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getAllOrderDetails,
};
