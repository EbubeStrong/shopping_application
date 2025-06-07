import bannerOne from "../../assets/Images/shoeOne.jpg";
import bannerTwo from "../../assets/Images/shoeTwo.jpg";
import bannerThree from "../../assets/Images/shoeThree.jpg";
import bannerFour from "../../assets/Images/shoeFour.jpg";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function ShoppingHome() {
  const slides = [bannerOne, bannerTwo, bannerThree, bannerFour];
  return (
    <div className="pt-[4rem] flex flex-col min-h-screen">
      <div className="relative w-full h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            {/* Blurred background image */}
            <img
              src={slide}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-[12px] scale-110 animate-pan"
            />

            {/* Foreground centered image */}
            <div className="relative flex items-center justify-center w-full h-full">
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="max-h-full object-contain z-10"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 z-10"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 z-10"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default ShoppingHome;

// import bannerOne from "../../assets/Images/shoeOne.jpg"
// import bannerTwo from "../../assets/Images/shoeTwo.jpg"
// import bannerThree from "../../assets/Images/shoeThree.jpg"
// import bannerFour from "../../assets/Images/shoeFour.jpg"
// import { Button } from "@/components/ui/button";
// import { ChevronLeftIcon } from "lucide-react";

// function ShoppingHome() {
//   const slides = [bannerOne, bannerTwo, bannerThree, bannerFour];
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="relative w-full h-[600px] overflow-hidden">
//         {slides.map((slide, index) => (
//           <img
//             key={index}
//               src={slide}
//               alt={`Slide ${index + 1}`}
//               className="absolute top-0 left-0 transition-opacity duration-1000 w-full h-full object-cover "
//             />
//         ))}
//
//       </div>
//     </div>
//   );
// }

// export default ShoppingHome;
