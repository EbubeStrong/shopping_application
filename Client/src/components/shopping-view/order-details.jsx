import React, { useState } from "react";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

function ShoppingOrderDetailsView({ orderDetails }) {
  const {user} = useSelector(state => state.auth)
  console.log(orderDetails, "OrderDetails")
  return (
    <>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="sm:max-w-[600px] "
        style={{ backgroundColor: "white" }}
      >
        <div className="grid gap-6 mt-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Order Date</p>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Payment Method</p>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-medium">Order Status</p>
              <Label>
                <Badge
                  className={`py-1 px-2 shadow-md ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "text-white bg-green-500"
                      : orderDetails?.orderStatus === "rejected" 
                        ? "text-white bg-red-600"
                        : orderDetails?.orderStatus === "delivered" 
                          ? "text-white bg-green-600"
                          : orderDetails?.orderStatus === "inProcess"
                            ? "text-white bg-blue-500"
                            : orderDetails?.orderStatus === "inShipping"
                              ? "text-white bg-orange-500"
                                      : "bg-black text-white"

                  }`}
                >
                  {orderDetails?.orderStatus}
                </Badge>
              </Label>
            </div>

            <Separator className="bg-black mt-6" />

            <div className="grid-gap-4 mt-1">
              <div className="grid gap-2">
                <div className="font-medium">Order Details</div>

                <ul className="grid-gap-3">
                  {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? orderDetails?.cartItems.map((item, key) => (
                    // console.log(item),
                     <li key={key} className="flex items-center justify-between">
                     <span className="w-full">Title: {item?.title}</span>
                     <div className="flex flex-col items-center justify-center w-full">
                     <span className="">Quantity: {item?.quantity}</span>
                     </div>
                     <span className="w-[250px] flex justify-start">Price: {item?.price}</span>
                   </li>
                  )) : null}
                 
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid-gap-2">
              <div className="font-medium">Shipping Info</div>

              <div className="grid gap-0.5 text-[hsl(var(--muted-foreground))]">
                <span>{user?.userName}</span>
                <span>{orderDetails?.addressInfo?.address}</span>
                <span>{orderDetails?.addressInfo?.city}</span>
                <span>{orderDetails?.addressInfo?.pincode}</span>
                <span>{orderDetails?.addressInfo?.phone}</span>
                <span>{orderDetails?.addressInfo?.notes}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </>
  );
}

export default ShoppingOrderDetailsView;
