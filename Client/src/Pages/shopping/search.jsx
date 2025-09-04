import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults } from "../../../store/shop/search-slice";
import { resetSearchResults } from "../../../store/shop/search-slice";
import { useSearchParams } from "react-router";
import ShoppingProductTile from "@/components/shopping-view/userProduct-tile";
import ProductDetailsDialog from "@/components/shopping-view/productDetails";
import { fetchProductDetails } from "../../../store/shop/product-slice";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "../../../store/shop/cart-slice";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
    setOpenDetailsDialog(true);
  }

  // Add to cart functionality
  function handleAddToCart(getCurrentProductId) {
    // console.log(getCurrentProductId, "get current Product Id")
    // console.log(cartItems, "cartItems from add to cart");

    const productInCart = cartItems?.items?.find(
      (item) => item.productId === getCurrentProductId
    );

    const getProductInfo = productList?.find(
      (item) => item._id === getCurrentProductId
    );
    //   ||productDetails?.find((item) => item.id === getCurrentProductId);

    if (!getProductInfo) return;

    if (productInCart && productInCart.quantity >= getProductInfo.totalStock) {
      toast({
        title: `Only ${getProductInfo.totalStock} quantities can be added for this item`,
        className: "bg-red-600 text-white",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      // console.log(data, "data after add to cart")
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: data?.payload?.message,
          className: "bg-green-600 text-white",
        });
      }
    });
  }

  // For the searchParams
  useEffect(() => {
    let timeoutId;

    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      timeoutId = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [keyword, dispatch, setSearchParams]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            name="searchKeyword"
            className="border border-gray-300 rounded-md py-2 px-4 w-full"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {!keyword ? (
        <h1 className="text-xl font-extrabold">
          Click on the searchbar to search for products
        </h1>
      ) : !searchResults.length ? (
        <h1 className="text-xl font-extrabold">No results found</h1>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {searchResults.map((product, index) => (
          <ShoppingProductTile
            key={index}
            product={product}
            handleAddToCart={handleAddToCart}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default SearchProducts;
