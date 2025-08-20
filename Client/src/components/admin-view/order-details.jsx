import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Label } from "../ui/label";

const initialFormData = {
    status: ""
}

function AdminOrderDetailsView() {
    const [formData, setFormData] = useState(initialFormData)

    function handleUpdateStatus(e){
        e.preventDefault()

    }

  return (
    <DialogContent
      classname="sm:max-w-[600px] "
      style={{ backgroundColor: "white" }}
    >
      <div className="grid gap-6 mt-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>12345</Label>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Date</p>
            <Label>15/08/2025</Label>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price</p>
            <Label>$1,000</Label>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status</p>
            <Label>In Process</Label>
          </div>

          <Separator className="bg-black mt-6" />

          <div className="grid-gap-4 mt-1">
            <div className="grid gap-2">
              <div className="font-medium">Order Details</div>

              <ul className="grid-gap-3">
                <li className="flex items-center justify-between">
                  <span>Product One</span>
                  <span>N500</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid-gap-2">
            <div className="font-medium">Shipping Info</div>

            <div className="grid gap-0.5 text-[hsl(var(--muted-foreground))]">
              <span>John Doe</span>
              <span>Address</span>
              <span>City</span>
              <span>Pincode</span>
              <span>Phone</span>
              <span>Notes</span>
            </div>
          </div>
        </div>

        <div>
            <CommonForm 
            formControls={[
                {
                    label: "Order Status",
                    name: "Order Status",
                    componentType: "select",
                    options: [
                      { id: "pending", label: "Pending" },
                      { id: "inProcess", label: "In Process" },
                      { id: "inShipping", label: "In Shipping" },
                      { id: "delivered", label: "Delivered" },
                      { id: "rejected", label: "Rejected" },
                    ],
                  },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={'Update Order Status'}
            onSubmit={handleUpdateStatus}
            />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
