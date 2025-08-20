import { PaymentProcessingDialog } from '@/components/shopping-view/payment-spinner'
import { Card, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

function PaypalReturnPage() {
  const dispatch = useDispatch()
  const location = useLocation()
  // const params = 


  return (
    <>
      <Card className="relative">
        <CardHeader>Processing Payment... Please wait!</CardHeader>
      </Card>
      <PaymentProcessingDialog /> {/* now no props needed */}
    </>
  )
}


export default PaypalReturnPage