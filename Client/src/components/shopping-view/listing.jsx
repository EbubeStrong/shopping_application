import ProductFilter from "@/Pages/shopping/filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "../../../store/shop/product-slice";
import ShoppingProductTile from "./userProduct-tile";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const [filter, setFilters] = useState(null)
  const [sort, setSort] = useState(null)

  useEffect(() => {
    dispatch(fetchAllFilteredProducts());
  }, [dispatch]);

  console.log(productList, "productListing");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter />

      <div className="bg-background w-full rounded-lg shadow-sm h-[calc(100vh-100px)] flex flex-col">
        <div className="p-4 sticky top-0 border-b flex items-center justify-between bg-background z-10">
          <h2 className="text-lg font-extra-bold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length} Products</span>

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

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem key={sortItem.id}>
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
              productList.map((product) => (
                <ShoppingProductTile key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No products available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
