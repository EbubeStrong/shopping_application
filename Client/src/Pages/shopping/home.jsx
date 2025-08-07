import bannerOne from "../../assets/Images/pic-1.png";
import bannerTwo from "../../assets/Images/pic-2.png";
import bannerThree from "../../assets/Images/pic-3.png";
import bannerFour from "../../assets/Images/pic-4.png";
import levisImage from "../../assets/Images/levisImage.jpg";

import bannerOneBg from "../../assets/Images/shoeOne.jpg";
import bannerTwoBg from "../../assets/Images/shoeTwo.jpg";
import bannerThreeBg from "../../assets/Images/shoeThree.jpg";
import bannerFourBg from "../../assets/Images/shoeFour.jpg";
// import levisImage from "../../assets/Images/levisImage.jpg";
import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FootprintsIcon,
  ShirtIcon,
  TrainFrontTunnelIcon,
  WatchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "../../../store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/userProduct-tile";
import { useNavigate } from "react-router-dom";

// Categories heading with icons
const categoriesHeadings = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: TrainFrontTunnelIcon },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: FootprintsIcon },
];

const brands = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "levis", label: "Levi's", logoIcon: levisImage },
  { id: "zara", label: "Zara" },
  { id: "handm", label: "H&M" },
];

function ShoppingHome() {
  const navigate = useNavigate();

  // State to manage the current slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideBg, setCurrentSlideBg] = useState(0);

  // Redux dispatch function for fetchingAllFilteredProducts
  const dispatch = useDispatch();

  const { productList } = useSelector((state) => state.shopProducts);

  // Array of banner images
  const slides = [bannerOne, bannerTwo, bannerThree, bannerFour];
  const slidesBg = [bannerOneBg, bannerTwoBg, bannerThreeBg, bannerFourBg]; 

  // Effect to change slides automatically every 3 seconds and to handle slide transitions
  useEffect(() => {
    // Automatically change slides every 6 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setCurrentSlideBg((prevSlide) => (prevSlide + 1) % slidesBg.length);
    }, 6000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length, slidesBg.length]);

  // Fetching filtered products
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-low-to-high",
      })
    );
  }, [dispatch]);

  // console.log(productList, productList);

  // Function to handle navigation to the listing page with category or brand
  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shopping/listing", {
      state: {
        filterParams: currentFilter,
        sortParams: "price-low-to-high",
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[500px] md:h-[800px] lg:h-[700px] pb-[2%]  overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute inset-0 w-full h-[80vh] md:h-[90vh] lg:h-[100vh] transition-opacity duration-1000 ease-in-out`}
          >
            {/* Blurred background image */}
            <img
              src={slidesBg[index]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-[30px] scale-110 animate-pan"
            />

            {/* Foreground centered image with glass background */}
            <div className="relative flex justify-center items-center w-full h-full">
              <div className="w-[60%] h-[50%] md:w-[50%] md:h-[60%] absolute top-[15%] bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl flex items-center justify-center">
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-[90%] h-[100%] md:h-[90%] object-contain z-10"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Left button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 z-10"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {/* Right button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 z-10"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Shop by category Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-40">
          <h2 className="text-3xl font-bold text-center mb-">
            Shop by category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
            {categoriesHeadings.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  onClick={() =>
                    handleNavigateToListingPage(category, "category")
                  }
                  key={category.id}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <IconComponent className="w-12 h-12 text-gray-700 mb-2" />
                  <h3 className="text-lg font-semibold">{category.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop by brand */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-40">
          <h2 className="text-3xl font-bold text-center mb-6">Shop by Brand</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
            {brands.map((brand) => {
              const IconComponent = brand.logoIcon;
              const logo = `https://cdn.simpleicons.org/${brand.id}`;
              return (
                <div
                  key={brand.id}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                >
                  {IconComponent ? (
                    <img
                      src={brand.logoIcon}
                      alt={`${brand.label} logo`}
                      className="w-12 h-12 mb-2"
                    />
                  ) : (
                    <img
                      src={logo}
                      alt={`${brand.label} logo`}
                      className="w-12 h-12 mb-2"
                    />
                  )}

                  <h3 className="text-lg font-semibold">{brand.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className=" py-12 bg-white">
        <div className="container w-full mx-auto md:px-40 ">
          <h2 className="text-3xl font-bold text-center mb-4 ">
            Feature Products
          </h2>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4">
            {productList && productList.length > 0 ? (
              productList.map((productItem, index) => (
                <ShoppingProductTile key={index} product={productItem} />
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                No products available.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
