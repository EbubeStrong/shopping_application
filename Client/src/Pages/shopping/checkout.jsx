import shoeOne from "../../assets/Images/pics1.jpg";
import shoeTwo from "../../assets/Images/pics2.jpg";
import shoeThree from "../../assets/Images/pics3.jpg";
import shoeFour from "../../assets/Images/pics4.jpg";
import shoeFive from "../../assets/Images/pics5.jpg";
import shoeSix from "../../assets/Images/pics6.jpg";

import palmsOne from "../../assets/Images/palms1.jpg";
import palmsTwo from "../../assets/Images/palms2.jpg";
import palmsThree from "../../assets/Images/palms3.jpg";
import palmsFour from "../../assets/Images/palms4.jpg";

import { useEffect, useState } from "react";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "../../../store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const {approvalURL} = useSelector(state => state.shopOrder)

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideBg, setCurrentSlideBg] = useState(0);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)

  const dispatch = useDispatch()

  const {toast} = useToast()

    // console.log(cartItems, "cartItems")
  // console.log(currentSelectedAddress, "selectedAddress")

  //image Array
  const imageSources = [
    shoeTwo,
    palmsOne,
    shoeOne,
    shoeThree,
    palmsTwo,
    shoeFour,
    palmsThree,
    palmsFour,
    shoeFive,
    shoeSix,
  ];

  const slides = imageSources;
  const slidesBg = imageSources;

  // Effect to change slides automatically every 3 seconds and to handle slide transitions
  useEffect(() => { 
    // Automatically change slides every 6 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setCurrentSlideBg((prevSlide) => (prevSlide + 1) % slidesBg.length);
    }, 4000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length, slidesBg.length]);

  // total cart amount functionality
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  // console.log(totalCartAmount, "total cart amount");

  //function for paypal payment
  function handleInitiatePaypalPayment() {
    if(cartItems.length === 0){
      toast({
        title: 'Your cart is empty. Please add items to cart to proceed',
        variant: 'destructive',
        className: "bg-red-600 text-white"
      })

      return
    }


    if(currentSelectedAddress  === null){
      toast({
        title: 'Please select one address to proceed.',
        variant: 'destructive',
        className: "bg-red-600 text-white"
      })

      return
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),

      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes
      },
      orderStatus: "pending",
      paymentStatus: "pending",
      paymentMethod: "paypal",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
    };

    console.log(orderData, "orderData")

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "CreatedNewOrder")
      if(data?.payload?.success){
        setIsPaymentStart(true)
      }else{
        setIsPaymentStart(false)
      }
    })
  }

  if(approvalURL){
    window.location.href = approvalURL
  }

  return (
    <div className="flex flex-col">
      {/* <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src=""
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div> */}

      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute mx-auto inset-0 w-full h-full transition-opacity duration-1000 ease-in-out py-7 md:py-10`}
          >
            {/* Blurred background image */}
            {/* <div
              className="absolute inset-0 w-full h-full object-cover filter blur-[30px] scale-110 animate-pan mb-[3px] "
            ></div> */}

            {/* Blurred background image with dark overlay */}
            <div className="absolute  inset-0 w-full h-full">
              <img
                src={slidesBg[index]}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover filter blur-[15px] scale-110 animate-pan"
              />
              <div className="absolute inset-0 bg-black/40 z-10"></div>
            </div>

            {/* Foreground centered image with glass background */}
            <div className="relative flex justify-center items-center md:w-[600px] mx-auto h-full z-10">
              <div className="h-full w-[50%] md:w-[60%] lg:w-[60%] md:h-[100%] absolute bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-4">
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[100%]  object-contain object-center z-10"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mt-5 p-6 ">
        <Address 
        gridCols={2} 
        setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                ${totalCartAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="bg-blue-950 hover:bg-blue-900 transition-colors duration-300 text-white w-full cursor-pointer"
            >{isPaymentStart ? 'Redirecting to Paypal...' : 'Checkout with Paypal'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
