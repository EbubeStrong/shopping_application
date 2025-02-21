import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false)

  function onSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={setOpenCreateProductsDialog}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>

              <SheetTitle>Add New Product</SheetTitle>

              <SheetDescription>
                Fill out the form below to add a new product.
              </SheetDescription>


              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadImageUrl={setUploadImageUrl}
                imageLoadingState = {imageLoadingState}
                setImageLoadingState = {setImageLoadingState}
              />


            </SheetHeader>

            <div className="py-6">
              <CommonForm
                formData={formData}
                formControls={addProductFormElements}
                setFormData={setFormData}
                buttonText="Add"
                onSubmit={onSubmit}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default AdminProducts;
