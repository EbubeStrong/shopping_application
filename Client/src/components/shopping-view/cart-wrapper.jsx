import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems }) {
  // console.log(cartItems, "cartItems in cart wrapper")

  // total cart amount functionality
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          ((currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity), 0
        )
      : 0;
  // console.log(totalCartAmount, "total cart amount")

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            // console.log(item, "cartItem in cart content")

            <UserCartItemsContent key={index} cartItem={item} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No items in cart.</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">N{totalCartAmount}</span>
        </div>
      </div>

      <Button className="w-full mt-6">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
