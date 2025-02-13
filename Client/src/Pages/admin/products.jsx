// import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet"; 
// import SheetTitle  from "../../components/ui/sheet"; 

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button>Add New Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={() => {
            setOpenCreateProductsDialog(false);
          }}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Add New Product</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default AdminProducts;
