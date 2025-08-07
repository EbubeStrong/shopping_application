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
import { useDispatch, useSelector } from "react-redux";

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
    }, 4000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length, slidesBg.length]);

  return (
    <>
      {/* <div className="relative h-[350px] w-full overflow-hidden">
        <img src="" alt="" className="h-full w-full object-center " />
      </div> */}

      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden">
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
                className="w-full h-full object-cover filter blur-[25px] scale-110 animate-pan"
              />
              <div className="absolute inset-0 bg-black/30 z-10"></div>
            </div>

            {/* Foreground centered image with glass background */}
            <div className="relative flex justify-center items-center md:w-[600px] mx-auto h-full z-10">
              <div className="h-full w-[50%] md:w-[60%] lg:w-[80%] md:h-[100%] absolute bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-4">
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[100%]  object-contain z-10"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ShoppingAccount;
