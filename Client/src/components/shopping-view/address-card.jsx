import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  currentSelectedAddress,
}) {
  const { toast } = useToast();

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => (
              setCurrentSelectedAddress(addressInfo?._id),
              toast({
                title: (
                  <>
                    Address is selected. <br />
                    Please, proceed and click the checkout button.
                  </>
                ),
                className: "bg-white text-black",
              })
            )
          : null
      }
      className={`flex flex-col justify-between cursor-pointer hover:shadow-md border hover:border-black ${currentSelectedAddress === addressInfo?._id ? 'bg-gray-200 shadow-xl' : ''}`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pin-Code: {addressInfo?.pincode}</Label>
        <Label>Phone Number: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>

      <CardFooter className="p-3 flex justify-between">
        <Button
          className="bg-black text-white cursor-pointer"
          onClick={() => handleEditAddress(addressInfo)}
        >
          Edit
        </Button>
        <Button
          className="bg-black text-white cursor-pointer"
          onClick={() => handleDeleteAddress(addressInfo)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
