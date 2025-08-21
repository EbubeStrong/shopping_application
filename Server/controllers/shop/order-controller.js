// const paypal = require("../../helpers/paypal");
// const Order = require("../../models/order");

// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentStatus,
//       paymentMethod,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId,
//       payerId,
//     } = req.body;

//     const create_payment_json = {
//       //   intent: "sale",
//       intent: "CAPTURE",
//       payer: {
//         payment_method: "paypal",
//       },
//       //   redirect_urls: {
//       application_context: {
//         return_url: "http://localhost:5000/shop/paypal-return",
//         cancel_url: "http://localhost:5000/shop/paypal-cancel",
//       },
//       //   transactions: [
//       purchase_units: [
//         {
//           item_list: {
//             items: cartItems.map((item) => ({
//               name: item.title,
//               sku: item.productId,
//               price: item.price.toFixed(2),
//               //   currency: 'NGN',
//               unit_amount: {
//                 currency_code: "NGN",
//               },
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "NGN",
//             total: totalAmount.toFixed(2),
//           },
//           description: "This is the payment description.",
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, async(error,paymentInfo) => {
//         if(error){
//             console.log(error)

//             return res.status(500).json({
//                 success: false,
//                 message: 'Error while creating paypal payment'
//             })
//         } else{
//             const newlyCreatedOrder = new Order({
//                 userId,
//                 cartItems,
//                 addressInfo,
//                 orderStatus,
//                 paymentStatus,
//                 paymentMethod,
//                 totalAmount,
//                 orderDate,
//                 orderUpdateDate,
//                 paymentId,
//                 payerId
//             })

//             await newlyCreatedOrder.save()

//             const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href

//             res.status(201).json({
//                 success: true,
//                 approvalURL,
//                 orderId: newlyCreatedOrder._id
//             })
//         }
//     });


//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred!",
//     });
//   }
// };

// const capturePayment = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred!",
//     });
//   }
// };

// module.exports = { createOrder, capturePayment };


// const paypalClient = require("../../helpers/paypal");
// const Order = require("../../models/order");

// async function createPayPalOrder(client, body) {
//   if (client?.orders?.create) {
//     return client.orders.create({ body });
//   }
//   if (client?.orders?.ordersCreate) {
//     return client.orders.ordersCreate({ body });
//   }
//   if (client?.ordersController?.createOrder) {
//     return client.ordersController.createOrder({ body });
//   }
//   if (client?.orders?.createOrder) {
//     return client.orders.createOrder({ body });
//   }
//   throw new Error("PayPal SDK does not expose an orders.create method on the client. Check SDK version and usage.");
// }

// async function capturePayPalOrder(client, orderId) {
//   if (client?.orders?.capture) {
//     return client.orders.capture(orderId, { body: {} });
//   }
//   if (client?.orders?.ordersCapture) {
//     return client.orders.ordersCapture(orderId, { body: {} });
//   }
//   if (client?.ordersController?.captureOrder) {
//     return client.ordersController.captureOrder(orderId, { body: {} });
//   }
//   if (client?.orders?.captureOrder) {
//     return client.orders.captureOrder(orderId, { body: {} });
//   }
//   throw new Error("PayPal SDK does not expose an orders.capture method on the client. Check SDK version and usage.");
// }

// // ✅ Create PayPal order
// const createOrder = async (req, res) => {
//   try {
//     if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
//       return res.status(500).json({
//         success: false,
//         message: "PayPal credentials are not set. Define PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your environment.",
//       });
//     }
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentStatus,
//       paymentMethod,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//     } = req.body;

//     // Build request body for server SDK
//     const returnUrl =
//       process.env.PAYPAL_RETURN_URL ||
//       `${process.env.CLIENT_URL || "http://localhost:5173"}/paypal-return`;
//     const cancelUrl =
//       process.env.PAYPAL_CANCEL_URL ||
//       `${process.env.CLIENT_URL || "http://localhost:5173"}/paypal-cancel`;
//     const items = cartItems.map((item) => ({
//       name: item.title,
//       sku: item.productId,
//       unit_amount: {
//         currency_code: "USD",
//         value: Number(item.price).toFixed(2),
//       },
//       quantity: String(item.quantity),
//     }));

//     const itemTotal = items
//       .reduce(
//         (sum, it) => sum + Number(it.unit_amount.value) * Number(it.quantity),
//         0
//       )
//       .toFixed(2);

//     const body = {
//       intent: "CAPTURE",
//       application_context: {
//         return_url: returnUrl,
//         cancel_url: cancelUrl,
//       },
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "USD",
//             value: Number(totalAmount).toFixed(2),
//             breakdown: {
//               item_total: {
//                 currency_code: "USD",
//                 value: itemTotal,
//               },
//             },
//           },
//           items,
//         },
//       ],
//     };

//     // Execute request via SDK client (compat across SDK shapes)
//     const response = await createPayPalOrder(paypalClient, body);

//     // Save to DB
//     const newOrder = new Order({
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentStatus,
//       paymentMethod,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId: response.result.id, // store PayPal ID
//     });
//     await newOrder.save();

//     // Grab approval URL
//     const result = response?.result || response?.body || response;
//     const approvalURL = (result.links || []).find((l) => l.rel === "approve")?.href;

//     res.status(201).json({
//       success: true,
//       approvalURL,
//       orderId: newOrder._id,
//     });
//   } catch (error) {
//     const statusCode = error?.statusCode || error?.status || 500;
//     const paypalDetails = error?.result || error?.response || null;
//     console.error("Error while creating PayPal order:", error);
//     res.status(500).json({
//       success: false,
//       message: error?.message || "Some error occurred while creating order",
//       details: paypalDetails,
//     });
//   }
// };

// // ✅ Capture PayPal order
// const captureOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const response = await capturePayPalOrder(paypalClient, orderId);

//     const result = response?.result || response?.body || response;
//     const captureStatus = result?.status;
//     const payerId =
//       result?.payer?.payer_id ||
//       result?.payment_source?.paypal?.account_id ||
//       "";

//     // Update our DB order by PayPal order id
//     const updatedOrder = await Order.findOneAndUpdate(
//       { paymentId: orderId },
//       {
//         paymentStatus: captureStatus === "COMPLETED" ? "paid" : "failed",
//         orderStatus: captureStatus === "COMPLETED" ? "confirmed" : "pending",
//         payerId,
//         orderUpdateDate: new Date(),
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       status: captureStatus,
//       order: updatedOrder,
//       details: result,
//     });
//   } catch (error) {
//     console.error("Error while capturing PayPal order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred while capturing order",
//     });
//   }
// };

// module.exports = { createOrder, captureOrder };


const paypal = require("@paypal/checkout-server-sdk");
const paypalClient = require("../../helpers/paypal");
const Order = require("../../models/order");
const Cart = require("../../models/cart");

// ✅ Create PayPal order
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId
    } = req.body;

    // Build items for PayPal
    const items = cartItems.map((item) => ({
      name: item.title,
      sku: item.productId,
      unit_amount: {
        currency_code: "USD",
        value: Number(item.price).toFixed(2),
      },
      quantity: String(item.quantity),
    }));

    const itemTotal = items.reduce(
      (sum, it) => sum + Number(it.unit_amount.value) * Number(it.quantity),
      0
    ).toFixed(2);


    // const paypalClient = client();

    // Build request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      // application_context: {
      //   return_url:
      //     // process.env.PAYPAL_RETURN_URL ||
      //     `${"http://localhost:5000"}/paypal-return`,
      //   cancel_url:
      //     // process.env.PAYPAL_CANCEL_URL ||
      //     // process.env.PAYPAL_CANCEL_URL
      //     // `${process.env.CLIENT_URL || "http://localhost:5000"}/paypal-cancel`,
      //     `${"http://localhost:5000"}/paypal-cancel`,
      // },

      // application_context: {
      //   return_url: `${process.env.PAYPAL_RETURN_URL || "http://localhost:5000/paypal-return"}`,
      //   cancel_url: `${process.env.PAYPAL_CANCEL_URL || "http://localhost:5000/paypal-cancel"}`,
      // },

      application_context: {
        return_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/shop/paypal-cancel`,
      },      
      
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: Number(totalAmount).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemTotal,
              },
            },
          },
          items,
        },
      ],
    });

    const response = await paypalClient.execute(request);
    const result = response.result;

    // Save to DB
    const newOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: result.id, // store PayPal order ID
      payerId,
      cartId
    });
    await newOrder.save();

    // Grab approval link
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

// ✅ Capture PayPal order
// const capturePayment = async (req, res) => {
//   // try {
//   //   const { orderId } = req.params;
//   //   // const { paymentId, payerId, orderId } = req.body;
    
//   //   const request = new paypal.orders.OrdersCaptureRequest(orderId);
//   //   request.requestBody({});

//   //   const response = await paypalClient.execute(request);
//   //   const result = response.result;

//   //   const captureStatus = result.status;

//   //   // Update DB with payment result
//   //   const updatedOrder = await Order.findOneAndUpdate(
//   //     { paymentId: orderId },
//   //     {
//   //       paymentStatus: captureStatus === "COMPLETED" ? "paid" : "failed",
//   //       orderStatus: captureStatus === "COMPLETED" ? "confirmed" : "pending",
//   //       orderUpdateDate: new Date(),
//   //     },
//   //     { new: true }
//   //   );

//   //   res.status(200).json({
//   //     success: true,
//   //     status: captureStatus,
//   //     order: updatedOrder,
//   //     details: result,
//   //   });
//   // } catch (error) {
//   //   console.error("Error while capturing PayPal order:", error);
//   //   res.status(500).json({
//   //     success: false,
//   //     message: error.message || "Some error occurred while capturing order",
//   //   });
//   // }

//   try {
    
//     const {paymentId, payerId, orderId} = req.body

//     let order =  await Order.findById(orderId)

//     if(!order){
//       return res.status(404).json({
//         success: false,
//         message: 'Order can not be found'
//       })
//     }

//     order.paymentStatus = 'paid'
//     order.orderStatus = 'confirmed'
//     order.paymentId = paymentId
//     order.payerId = payerId
//     order.paypalOrderId = paypalOrderId; // store PayPal's orderId


//     const getCartId = order.cartId
//     const cart = await Cart.findByIdAndDelete(getCartId)

//     await order.save()

//     res.status(200).json({
//       success: true,
//       message: 'Order Confirmed',
//       data: order
//     })

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred"
//     })
//   }
// };


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
        message: "Missing required parameters: paypalOrderId, payerId, or orderId",
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
          if (errorDetails.details && errorDetails.details.some(detail => detail.issue === "ORDER_ALREADY_CAPTURED")) {
            console.log("PayPal order already captured, proceeding with order update");
            
            // Since the order is already captured, we can proceed with updating our database
            // We'll treat this as a successful capture
            paypalResponse = {
              result: {
                status: "COMPLETED",
                id: paypalOrderId
              }
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
    console.error("PayPal Capture Error:", error.message, error.response?.data || error);
    
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


module.exports = { createOrder, capturePayment };
