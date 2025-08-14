import shoeOne from "../../assets/Images/shoe_one.jpg";
import shoeTwo from "../../assets/Images/shoe_two.jpg";
import shoeThree from "../../assets/Images/shoe_three.jpg";
import shoeFour from "../../assets/Images/shoe_four.jpg";
import shoeFive from "../../assets/Images/shoe_five.jpg";
import shoeSix from "../../assets/Images/shoe_six.jpg";
import shoeSeven from "../../assets/Images/shoe_seven.jpg";
import shoeSEight from "../../assets/Images/shoe_eight.jpg";
import shoeNine from "../../assets/Images/shoe_nine.jpg";

import palmsOne from "../../assets/Images/palms_one.jpg";
import palmsTwo from "../../assets/Images/palms_two.jpg";
import palmsThree from "../../assets/Images/palms_three.jpg";
import palmsFour from "../../assets/Images/palms_four.jpg";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Orders from "@/components/shopping-view/orders";
import Address from "@/components/shopping-view/address";

function ShoppingAccount() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideBg, setCurrentSlideBg] = useState(0);

  const imageSources = [
    shoeOne,
    palmsOne,
    shoeTwo,
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
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length, slidesBg.length]);

  return (
    <div className="flex flex-col">
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
              <div className="h-full w-[50%] md:w-[60%] md:h-[100%] absolute bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-2">
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

      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Orders />
            </TabsContent>
             
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  );
}

export default ShoppingAccount;
