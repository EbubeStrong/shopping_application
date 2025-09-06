import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Card className="relative border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-4xl">Processing Successful!</CardTitle>
        </CardHeader>

        <Button 
        onClick={() => navigate('/shop/account')}
        className="mt-4 ml-6 bg-black text-white cursor-pointer">View Orders</Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
