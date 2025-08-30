import { Button } from "@/components/ui/button";
import bannerOneBg from "../../assets/Images/shoeOne.jpg";
import bannerTwoBg from "../../assets/Images/shoeTwo.jpg";
import bannerThreeBg from "../../assets/Images/shoeThree.jpg";
import bannerFourBg from "../../assets/Images/shoeFour.jpg";

import bannerOne from "../../assets/Images/pic-1.png";
import bannerTwo from "../../assets/Images/pic-2.png";
import bannerThree from "../../assets/Images/pic-3.png";
import bannerFour from "../../assets/Images/pic-4.png";
import levisImage from "../../assets/Images/levisImage.jpg";


import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FootprintsIcon,
  ShirtIcon,
  TrainFrontTunnelIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/product-slice";
import ShoppingProductTile from "@/components/shopping-view/userProduct-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "../../../store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/productDetails";
// import { getFeatureImages } from "@/store/common-slice";

// Categories heading with icons
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: TrainFrontTunnelIcon },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: FootprintsIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "levis", label: "Levi's", logoIcon: levisImage },
  { id: "zara", label: "Zara" },
  { id: "handm", label: "H&M" },
];

function ShoppingHome() {
  //   // State to manage the current slide index
  const [currentSlideBg, setCurrentSlideBg] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  // const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

    // Array of banner images
  const slides = [bannerOne, bannerTwo, bannerThree, bannerFour];
  const slidesBg = [bannerOneBg, bannerTwoBg, bannerThreeBg, bannerFourBg]; 

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);



   // Effect to change slides automatically every 3 seconds and to handle slide transitions
  useEffect(() => {
    // Automatically change slides every 6 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setCurrentSlideBg((prevSlide) => (prevSlide + 1) % slidesBg.length);
    }, 6000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length, slidesBg.length]);



  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-low-to-high",
      })
    );
  }, [dispatch]);


  console.log(productList, "productList");

  // useEffect(() => {
  //   dispatch(getFeatureImages());
  // }, [dispatch]);

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
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoriesWithIcon.map((categoryItem) => {
              const IconComponent = categoryItem.icon;
              return (
                 <Card
                  key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer border-none hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                   <IconComponent className="w-12 h-12 text-gray-700 mb-2" />
                  {/* <categoryItem.icon className="w-12 h-12 mb-4 text-primary" /> */}
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
              );
            })}


          </div>
        </div>
      </section>

      {/* Shop by brand */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Shop by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-8">
            {brandsWithIcon.map((brand) => {
              const IconComponent = brand.logoIcon;
              const logo = `https://cdn.simpleicons.org/${brand.id}`;
              return (
                 <Card
                  key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow border-none"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
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
                  <span className="font-bold">{brand.label}</span>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                  key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;