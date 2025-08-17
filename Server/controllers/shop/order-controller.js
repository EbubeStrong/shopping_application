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


const paypalClient = require("../../helpers/paypal");
const { OrdersCreateRequest, OrdersCaptureRequest } = require("@paypal/paypal-server-sdk");
const Order = require("../../models/order");

// ✅ Create a new PayPal order
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
    } = req.body;

    // Build PayPal request
    const request = new OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        return_url: "http://localhost:5000/shop/paypal-return",
        cancel_url: "http://localhost:5000/shop/paypal-cancel",
      },
      purchase_units: [
        {
          amount: {
            currency_code: "NGN", // ✅ set your currency
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "NGN",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.productId,
            unit_amount: {
              currency_code: "NGN",
              value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
          description: "This is the payment description.",
        },
      ],
    });

    // Execute request with PayPal SDK
    const response = await paypalClient.execute(request);

    // Save order in DB
    const newlyCreatedOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: response.result.id,
      payerId: null,
    });

    await newlyCreatedOrder.save();

    // Extract approval URL from PayPal response
    const approvalURL = response.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(201).json({
      success: true,
      approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.error("Error while creating PayPal order:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating order",
    });
  }
};

// ✅ Capture PayPal order after user approval
const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const request = new OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await paypalClient.execute(request);

    res.status(200).json({
      success: true,
      status: response.result.status,
      details: response.result,
    });
  } catch (error) {
    console.error("Error while capturing PayPal order:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while capturing order",
    });
  }
};

module.exports = {
  createOrder,
  captureOrder,
};
