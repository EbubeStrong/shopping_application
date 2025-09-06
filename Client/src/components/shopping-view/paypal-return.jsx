import React, { useEffect } from "react";
import { PaymentProcessingDialog } from "@/components/shopping-view/payment-spinner";
import { Card, CardHeader } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { capturePayment } from "../../../store/shop/order-slice";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // PayPal returns different parameters based on the API version
  // For newer PayPal API, it returns 'token' as the order ID
  // For older API, it might return 'orderId'
  const paypalOrderId = params.get('token') || params.get('orderId') || params.get('paymentId');
  const payerId = params.get("PayerID") || params.get("payer_id"); // ✅ Payer ID

  // Add a flag to prevent multiple processing
  const [isProcessing, setIsProcessing] = React.useState(false);

  useEffect(() => {
    const processPayment = async () => {
      // Prevent multiple processing
      if (isProcessing) {
        console.log("Payment already being processed, skipping...");
        return;
      }

      // Check if payment is already being processed in session storage
      const processingKey = `processing_payment_${paypalOrderId}`;
      if (sessionStorage.getItem(processingKey)) {
        console.log("Payment already being processed (session storage), skipping...");
        return;
      }

      try {
        setIsProcessing(true);
        sessionStorage.setItem(processingKey, "true");
        console.log("=== PayPal Return Debug ===");
        console.log("All URL parameters:", Object.fromEntries(params));
        console.log("Extracted paypalOrderId:", paypalOrderId);
        console.log("Extracted payerId:", payerId);
        
        if (paypalOrderId && payerId) {
          const orderId = JSON.parse(sessionStorage.getItem("currentOrderId")); // ✅ your DB order id
          console.log("Order ID from sessionStorage:", orderId);

          const result = await dispatch(capturePayment({
            paypalOrderId: paypalOrderId, // from token
            payerId: payerId, // from PayerID
            orderId // from sessionStorage
          }));

          console.log("Capture payment result:", result);

          if (result.payload?.success) {
            console.log("Payment successful, redirecting to success page");
            sessionStorage.removeItem("currentOrderId");
            // Give the dialog a moment to render before navigating
            setTimeout(() => {
              window.location.href = "/shop/payment-success";
            }, 700);
          } else {
            console.error("Payment capture failed:", result.payload);
            // Handle payment failure - redirect to error page or show error message
            window.location.href = "/shop/checkout?error=payment_failed";
          }
        } else {
          console.error("Missing PayPal parameters - paypalOrderId:", paypalOrderId, "payerId:", payerId);
          window.location.href = "/shop/checkout?error=missing_params";
        }
      } catch (error) {
        console.error("Payment error:", error);
        window.location.href = "/shop/checkout?error=payment_error";
      } finally {
        setIsProcessing(false);
        sessionStorage.removeItem(processingKey);
      }
    };

    processPayment();
  }, [paypalOrderId, payerId, dispatch]);

  return (
    <>
      <Card className="relative">
        <CardHeader>Processing Payment... Please wait!</CardHeader>
      </Card>
      <PaymentProcessingDialog forceOpen={true} />
    </>
  );
}

export default PaypalReturnPage;
