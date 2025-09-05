import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  updateCartQuantity,
} from "../../../store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
// import { fetchProductDetails } from "../../../store/shop/product-slice";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  // console.log(cartItem, "cartItem");

  const dispatch = useDispatch();
  const { toast } = useToast();

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
          className: "bg-white",
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
  const allCartItems = cartItem?.items ?? [];
  const productId = String(getCartItem?.productId ?? "");

  const cartIndex = allCartItems.findIndex(item => String(item.productId) === productId);

  const productIndex = (productList?.findIndex
    ? productList.findIndex(prod => String(prod._id ?? prod.id) === productId)
    : -1);

  // Prefer productList stock, fall back to cart item if you stored it there
  const totalStockRaw =
    productIndex > -1 ? productList[productIndex]?.totalStock : getCartItem?.totalStock;

  const totalStock = Number(totalStockRaw);
  if (!Number.isFinite(totalStock)) {
    console.warn("Missing totalStock", { productIndex, totalStockRaw, prodId });
    toast({
      title: "Product stock not loaded yet",
      variant: "destructive",
    });
    return;
  }

  const currentQty = Number(allCartItems[cartIndex]?.quantity ?? getCartItem?.quantity ?? 0);
  let newQty = typeOfAction === "plus" ? currentQty + 1 : currentQty - 1;

  if (typeOfAction === "plus" && newQty > totalStock) {
    toast({
      title: `Only ${totalStock} quantities can be added for this item`,
      variant: "destructive",
      className: "bg-red-600 text-white"
    });
    return;
  }

  if (typeOfAction !== "plus" && newQty < 1) {
    toast({
      title: "Quantity cannot be less than 1",
      variant: "destructive",
      className: "bg-red-600 text-white"
    });
    return;
  }

  dispatch(updateCartQuantity({
    userId: user?.id,             
    productId: productId,
    quantity: newQty,
  })).then((data) => {
    if (data?.payload?.success) {
      toast({ 
        title: "Cart item is updated successfully",
        className: "bg-white"
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
