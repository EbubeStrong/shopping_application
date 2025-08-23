import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin } from "../../../store/admin/order-slice";
import { resetOrderDetails } from "../../../store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const {orderList, orderDetails} = useSelector(state => state.adminOrder)
  // console.log(orderList, "Order List")
  console.log(orderDetails, "Order Details")

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

  const dispatch =  useDispatch()

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin())
  }, [dispatch])

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem, key) => {
                  return (
                    <TableRow key={key}>
                      <TableCell>{orderItem?._id}</TableCell>
                      <TableCell>
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-2 shadow-md ${
                            orderItem?.orderStatus === "confirmed"
                              ? "text-white bg-green-500"
                              : orderItem?.orderStatus === "rejected" 
                                ? "text-white bg-red-600"
                                : orderItem?.orderStatus === "delivered" 
                                  ? "text-white bg-green-600"
                                  : orderItem?.orderStatus === "inProcess"
                                    ? "text-white bg-blue-500"
                                    : orderItem?.orderStatus === "inShipping"
                                      ? "text-white bg-orange-500"
                                      : "bg-white text-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${orderItem?.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          // onOpenChange={setOpenDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false)
                            dispatch(resetOrderDetails())
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            className="bg-black/90 text-white cursor-pointer"
                          >
                            View Details
                          </Button>

                          <AdminOrderDetailsView orderDetails={orderDetails}/>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
