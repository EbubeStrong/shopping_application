import { data } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddToCart }) {
  return (
    <Card className="w-[100%] max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="w-full relative overflow-hidden rounded-t-lg">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover transform transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
            loading="lazy"
          />
          {
          product?.totalStock === 0 ? 
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
              Out of Stock
            </Badge>
          :

          product?.totalStock <= 10 ? 
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          :
          
          product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-red-600 text-white">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {product?.category.charAt(0).toUpperCase() +
                product?.category.slice(1)}
            </span>

            <span className="text-sm text-muted-foreground">
              {product?.brand.charAt(0).toUpperCase() + product?.brand.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>

            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
      
        <Button
          onClick={() => {
            console.log("Clicked Add to Cart for:", product?._id);
            handleAddToCart(product?._id);
          }}
        
          className={`${
          product?.totalStock === 0  ? "cursor-not-allowed opacity-60 w-full bg-black/90 text-white" :
           "w-full bg-black/90 text-white cursor-pointer"}`}

        >
         { 
         product?.totalStock === 0 ? "Out of Stock" :
          "Add to cart"
         }
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
