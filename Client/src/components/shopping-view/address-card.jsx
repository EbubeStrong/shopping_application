

import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

function AddressCard({addressInfo}) {
  return (
    <Card>
        <CardContent className="grid p-4 gap-4">
            <Label>Address: {addressInfo?.address}</Label>
            <Label>City: {addressInfo?.city}</Label>
            <Label>Pin-Code: {addressInfo?.pincode}</Label>
            <Label>Phone Number:{addressInfo?.phone}</Label>
            <Label>Notes: {addressInfo?.notes}</Label>
        </CardContent>

        <CardFooter className="p-3 flex justify-between">
            <Button>Edit</Button>
            <Button>Delete</Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard