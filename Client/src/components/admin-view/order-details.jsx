// import React, { useState } from "react";
// import { DialogContent, DialogTitle } from "../ui/dialog";
// import { Separator } from "../ui/separator";
// import { Label } from "../ui/label";
// import { Badge } from "../ui/badge";
// import { useSelector } from "react-redux";

// const initialFormData = {
//   status: ""
// }

// function AdminOrdersDetailView({ orderDetails }) {
//   const [formData, setFormData] = useState(initialFormData)
//   const {user} = useSelector(state => state.auth)
//   // console.log(user)

//   function handleUpdateStatus(event){
//     event.preventDefault()
//   }
//   return (
//     <>
//       <DialogTitle></DialogTitle>
//       <DialogContent
//         className="sm:max-w-[600px] "
//         style={{ backgroundColor: "white" }}
//       >
//         <div className="grid gap-6 mt-6">
//           <div className="grid gap-2">
//             <div className="flex items-center justify-between">
//               <p className="font-medium">Order ID</p>
//               <Label>{orderDetails?._id}</Label>
//             </div>

//             <div className="flex items-center justify-between mt-2">
//               <p className="font-medium">Order Date</p>
//               <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
//             </div>

//             <div className="flex items-center justify-between mt-2">
//               <p className="font-medium">Order Price</p>
//               <Label>${orderDetails?.totalAmount}</Label>
//             </div>

//             <div className="flex items-center justify-between mt-2">
//               <p className="font-medium">Payment Method</p>
//               <Label>{orderDetails?.paymentMethod}</Label>
//             </div>

//             <div className="flex items-center justify-between mt-2">
//               <p className="font-medium">Payment Status</p>
//               <Label>{orderDetails?.paymentStatus}</Label>
//             </div>

//             <div className="flex items-center justify-between mt-2">
//               <p className="font-medium">Order Status</p>
//               <Label>
//                 <Badge
//                   className={`py-1 px-2 bg-white shadow-md ${
//                     orderDetails?.orderStatus === "confirmed"
//                       ? "text-white bg-green-500"
//                       : "text-black"
//                   }`}
//                 >
//                   {orderDetails?.orderStatus}
//                 </Badge>
//               </Label>
//             </div>

//             <Separator className="bg-black mt-6" />

//             <div className="grid-gap-4 mt-1">
//               <div className="grid gap-2">
//                 <div className="font-medium">Order Details</div>

//                 <ul className="grid-gap-3">
//                   {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? orderDetails?.cartItems.map((item, key) => (
//                      <li key={key} className="flex items-center justify-between">
//                      <span className="w-full">Title: {item?.title}</span>
//                      <div className="flex flex-col items-center justify-center w-full">
//                      <span className="">Quantity: {item?.quantity}</span>
//                      </div>
//                      <span className="w-[250px] flex justify-start">Price: {item?.price}</span>
//                    </li>
//                   )) : null}

//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="grid gap-4">
//             <div className="grid-gap-2">
//               <div className="font-medium">Shipping Info</div>

//               <div className="grid gap-0.5 text-[hsl(var(--muted-foreground))]">
//                 <span>{user?.userName}</span>
//                 <span>{orderDetails?.addressInfo?.address}</span>
//                 <span>{orderDetails?.addressInfo?.city}</span>
//                 <span>{orderDetails?.addressInfo?.pincode}</span>
//                 <span>{orderDetails?.addressInfo?.phone}</span>
//                 <span>{orderDetails?.addressInfo?.notes}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </>
//   );
// }

// export default AdminOrdersDetailView;

import React, { useState } from "react";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "../../../store/admin/order-slice";
import { useToast } from "../../hooks/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.adminOrder);

  const dispatch = useDispatch()

  function handleUpdateStatus(e) {
    e.preventDefault();
    
    const {status} = formData

    if (status) {
      dispatch(updateOrderStatus({id: orderDetails?._id, orderStatus: status})).then((result) => {
        

        if (result.payload?.success) {
          console.log(result, "Update Order Status")
          toast({
            title: "Success",
            description: "Order status updated successfully!",
            className: "bg-white"
          });
          setFormData(initialFormData)
          // Refresh the order list to show updated status
          dispatch(getAllOrdersForAdmin())
        } else {
          toast({
            title: "Error",
            description: result.payload?.message || "Failed to update order status",
            variant: "destructive",
            className: "bg-red-500"
          });
        }
      }).catch((error) => {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
          className: "bg-red-500"
        });
      })

      
    } else {
      toast({
        title: "Error",
        description: "Please select an order status",
        variant: "destructive",
        className: "bg-red-500"
      });
    }

    
  }

  return (
    <>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="sm:max-w-[600px]"
        style={{
          backgroundColor: "white",
          overflowY: "scroll",
          height: "750px",
        }}
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
                  {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                    ? orderDetails?.cartItems.map((item, key) => (
                        <li
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="w-full">Title: {item?.title}</span>
                          <div className="flex flex-col items-center justify-center w-full">
                            <span className="">Quantity: {item?.quantity}</span>
                          </div>
                          <span className="w-[250px] flex justify-start">
                            Price: {item?.price}
                          </span>
                        </li>
                      ))
                    : null}
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

          <div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
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
              buttonText={isLoading ? "Updating..." : "Update Order Status"}
              onSubmit={handleUpdateStatus}
              isBtnDisabled={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </>
  );
}

export default AdminOrderDetailsView;
