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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "../../../store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  // console.log(orderList, "orderList")
  // console.log(orderDetails , "orderDetails ")

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
    console.log(dispatch(getAllOrdersByUserId(user?.id)));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
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

                          <ShoppingOrderDetailsView orderDetails={orderDetails}/>
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

export default ShoppingOrders;
