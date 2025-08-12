import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddresses,
  deleteAddresses,
  editAddresses,
  fetchAllAddresses,
} from "../../../store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address() {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => {
    // console.log(state);
    return state.shopAddress;
  });

  //   console.log(addressList);

  const {toast} = useToast()

//   function to manage Editing or Adding of New Address
  function handleManageAddress(e) {
    e.preventDefault();

    if(addressList.length >= 3 && currentEditedId === null){
        setFormData(initialAddressFormData)
        toast({
            title: "You can only add maximum of 3 addresses",
            variant: "destructive"
        })
        return
    }

    currentEditedId !== null
      ? dispatch(
          editAddresses({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null)
            setFormData(initialAddressFormData)
            toast({
                title : "Address updated successfully"
            })
          }
        })
      : dispatch(
          addNewAddresses({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          console.log(data);
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
                title: "Address added successfully"
            })
          }
        });
  }

  //   function to delete address
  function handleDeleteAddress(getCurrentAddress) {
    // console.log(getCurrentAddress)

    dispatch(
      deleteAddresses({
        userId: user?.id,
        addressId: getCurrentAddress._id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
            title : "Address deleted successfully"
        })
      }
    });
  }

  //   function to edit address
  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }

  // checking of form validation
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  // rendering all the fecthAllAddressess
  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem, index) => (
              <AddressCard
                key={index}
                addressInfo={singleAddressItem}
                handleDeleteAddress={handleDeleteAddress}
                handleEditAddress={handleEditAddress}
              />
            ))
          : null}
      </div>

      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
