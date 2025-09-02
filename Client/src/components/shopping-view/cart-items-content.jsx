import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "../../../store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";


function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const dispatch = useDispatch();
  const {toast} = useToast();

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart Item is deleted successfully",
          className: 'bg-white'
        });
      }
    });
  }

  // for cart handlers + and  -
  // function handleUpdateQuantity(getCartItem, typeOfAction) {
  //   dispatch(
  //     updateCartQuantity({
  //       userId: user?.id,
  //       productId: getCartItem?.productId,
  //       quantity:
  //         typeOfAction === "plus"
  //           ? getCartItem?.quantity + 1
  //           : getCartItem?.quantity - 1,
  //     })
  //   ).then((data) => {
  //     if (data?.payload?.success) {
  //       toast({
  //         title: "Cart Item is updated successfully",
  //         className: 'bg-white'
  //       });
  //     }
  //   });
  // }

  function handleUpdateQuantity(getCartItem, typeOfAction) {
  // Find the product’s stock info
 const getProductInfo =
  //  First, try to find the product in productList (an array of all products)
  productList?.find(
    (item) => (item._id ?? item.id) === getCartItem?.productId
  ) ??
  // 2, If not found in productList, check productDetails
  (
    Array.isArray(productDetails)
      // 2a: If productDetails is an array, find the product in that array
      ? productDetails.find(
          (item) => (item._id ?? item.id) === getCartItem?.productId
        )
      // 2b: Else if productDetails is a single object (not array), check if it matches
      : (
          productDetails &&
          ((productDetails._id ?? productDetails.id) === getCartItem?.productId
            ? productDetails
            : null)
        )
  );


  if (!getProductInfo) return;

  const totalStock = getProductInfo.totalStock ?? 0;

  // Compute the new quantity before dispatch
  let newQuantity =
    typeOfAction === "plus"
      ? getCartItem?.quantity + 1
      : getCartItem?.quantity - 1;

  // Stop if trying to exceed stock
  if (newQuantity > totalStock) {
    toast({
      title: "Product is out of stock",
      className: "bg-red-600 text-white",
    });
    return;
  }

  // Stop if quantity would drop below 1 (optional safeguard)
  if (newQuantity < 1) {
    toast({
      title: "Quantity cannot be less than 1",
      className: "bg-red-600 text-white",
    });
    return;
  }

  // Dispatch the update
  dispatch(
    updateCartQuantity({
      userId: user?.id,
      productId: getCartItem?.productId,
      quantity: newQuantity,
    })
  ).then((data) => {
    if (data?.payload?.success) {
      toast({
        title: "Cart Item is updated successfully",
        className: "bg-white",
      });
    }
  });
}


  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 object-cover"
      />

      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex gap-2 items-center mt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            disabled={cartItem?.quantity === 1}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full cursor-pointer "
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1 hover:text-red-600"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
