

import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

function AddressCard({addressInfo, handleDeleteAddress, handleEditAddress}) {
  return (
    <Card className="flex flex-col justify-between">
        <CardContent className="grid p-4 gap-4">
            <Label>Address: {addressInfo?.address}</Label>
            <Label>City: {addressInfo?.city}</Label>
            <Label>Pin-Code: {addressInfo?.pincode}</Label>
            <Label>Phone Number: {addressInfo?.phone}</Label>
            <Label>Notes: {addressInfo?.notes}</Label>
        </CardContent>

        <CardFooter className="p-3 flex justify-between">
            <Button className="bg-black text-white cursor-pointer"
            onClick={() => handleEditAddress(addressInfo)}
            >Edit</Button>
            <Button className="bg-black text-white cursor-pointer"
            onClick={() => handleDeleteAddress(addressInfo)}
            >Delete</Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard