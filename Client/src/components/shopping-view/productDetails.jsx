import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { setProductDetails } from "../../../store/shop/product-slice";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) {
  const dispatch = useDispatch();

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTitle>
        </DialogTitle>
        <DialogContent className="grid md:grid-cols-2 grid-cols-1 gap-8 sm:p-12 overflow-y-scroll md:overflow-hidden h-[700px] md:h-[600px] md:max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white">
          <div className="relative  rounded-lg">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              width={600}
              height={600}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="">
            <div>
              <h1 className="text-3xl font-extrabold">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground text-2xl mb-5 mt-4">
                {productDetails?.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-3xl font-bold text-primary ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                N{productDetails?.price}
              </p>

              {productDetails?.salePrice > 0 && (
                <p className="text-2xl font-bold text-muted-foreground">
                  N{productDetails?.salePrice}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0 5">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
              </div>
              <span className="text-muted-foreground">(4.5)</span>
            </div>

            <div className="mt-5 mb-5">
              <Button
                disabled={productDetails?.totalStock === 0}
                className={`${
                  productDetails?.totalStock === 0
                    ? "cursor-not-allowed opacity-60 w-full bg-black/90 text-white"
                    : "w-full bg-black/90 text-white cursor-pointer"
                }`}
                onClick={() => (
                  handleAddToCart(productDetails?._id),
                  setOpen(false)
                )}
              >
                {" "}
                {productDetails?.totalStock === 0
                  ? "Out of Stock"
                  : "Add to cart"}
              </Button>
            </div>

            <Separator />

            <div className="max-h-[250px] overflow-auto pb-7">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>

              <div className="grid gap-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>

                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Ebube Strong</h3>
                    </div>

                    <div className="flex items-center gap-0 5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>

                    <p className="text-muted-foreground">
                      This is an awesome product
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>

                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Ebube Strong</h3>
                    </div>

                    <div className="flex items-center gap-0 5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>

                    <p className="text-muted-foreground">
                      This is an awesome product
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>

                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Ebube Strong</h3>
                    </div>

                    <div className="flex items-center gap-0 5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>

                    <p className="text-muted-foreground">
                      This is an awesome product
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>E</AvatarFallback>
                  </Avatar>

                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">Ebube Strong</h3>
                    </div>

                    <div className="flex items-center gap-0 5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>

                    <p className="text-muted-foreground">
                      This is an awesome product
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Input placeholder="Write a review..." />
                <Button className="bg-black text-white">Submit</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductDetailsDialog;
