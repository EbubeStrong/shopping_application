import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React from "react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="text-2xl font-bold">
          Product Details
        </DialogTitle>
        <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              width={600}
              height={600}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-extrabold">
                {productDetails?.title}
              </h1>
              <p className="text-muted-foreground">
                {productDetails?.description}
              </p>
                      </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductDetailsDialog;
