import ProductFilter from "@/components/shopping-view/filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/product-slice";
import ShoppingProductTile from "../../components/shopping-view/userProduct-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/productDetails";
import {
  addToCart,
  fetchCartItems,
} from "../../../store/shop/cart-slice/index";
import { useToast } from "@/hooks/use-toast";
// import { title } from "process";


function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const { toast } = useToast();

  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  // console.log(productList, "ProductList")
  
  const { cartItems } = useSelector((state) => state.shopCart);

  
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  function handleSort(value) {
    // console.log(value)
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    
    let cpyFilters = { ...filters };

    // console.log(cpyFilters);

    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption] };
    }

    // if (indexOfCurrentSection === -1) {
    //   cpyFilters[getSectionId] = [getCurrentOption];
    // }
    else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }



  // Add to cart functionality
  function handleAddToCart(getCurrentProductId) {
    // console.log(getCurrentProductId, "get current Product Id")

    const productInCart = cartItems?.items?.find(
      (item) => item.productId === getCurrentProductId
    );
    console.log(productInCart, "productInCart")

    const getProductInfo = productList?.find((item) => item._id === getCurrentProductId) || productDetails?.find(
      (item) => item.id === getCurrentProductId
    );

    if(!getProductInfo) return;

    if(productInCart && productInCart.quantity >= getProductInfo.totalStock){
      toast({
        title:`Only ${getProductInfo.totalStock} quantities can be added for this item`,
        className: "bg-red-600 text-white"
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
      console.log(data, "data after add to cart")
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: data?.payload?.message,
          className: "bg-green-600 text-white"
        });
      }
    });
  }

  //getting search params of the category, then pass it down in the useEffect below
  const categorySearchParam = searchParams.get('category')

  // sorting useEffect
  useEffect(() => {
    setSort("price-low-to-high");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);


  // For Params
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  
  //not filters and sorting UseEffect
  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  // console.log(productList, "productListing");
  // console.log(filters, "filters");



  // For product Details
  function handleGetProductDetails(getCurrentProductId) {
    // console.log(getCurrentProductId)
    dispatch(fetchProductDetails(getCurrentProductId));
  }


  // For product details dialog
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  // console.log(productDetails, "productDetails");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6 min-h-screen">
      
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm h-[calc(100vh-100px)] flex flex-col pb-[3rem]">
        <div className="p-4 sticky top-0 border-b flex items-center justify-between bg-background z-10">
          <h2 className="text-lg font-extra-bold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px] bg-white">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="cursor-pointer"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div
          className="overflow-y-auto flex-1 p-4"
          style={{
            overflowY: "auto",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE & Edge
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {productList && productList.length > 0 ? (
              productList.map((product, index) => (
                <ShoppingProductTile
                  key={index}
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No products available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default ShoppingListing;
