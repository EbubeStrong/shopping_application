import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  fetchAllProducts,
} from "../../../store/admin/products-slice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "@/components/admin-view/product-tile";
import { useOutletContext } from "react-router-dom";

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
  
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Renamed for clarity
  const [imageLoadingState, setImageLoadingState] = useState(false);

  // a way for passing of props through / when using Outlet
   const {
     openCreateProductsDialog,
     setOpenCreateProductsDialog,
  } = useOutletContext();
  


  const productList = useSelector(
    (state) => state.adminProducts.productList.data || []
  );

  // console.log('productList', productList)

  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log("Form Data Before Submitting:", {
    ...formData,
    image: uploadedImageUrl,
  });

  function onSubmit(e) {
    e.preventDefault();

    if (!uploadedImageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image before submitting",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrl,
      })
    ).then((data) => {
      console.log("Submitting form:", formData, uploadedImageUrl);
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setFormData(initialFormData);
        setImageFile(null);
        toast({
          title: "Success",
          description: "Product added successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data?.payload?.message || "Error adding product",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);



  // console.log(productList, "productList");

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 lg:ml-64 p-6 ">
        {productList && productList.length > 0
          ? productList.map((productItem, index) => {
              console.log("Rendering product:", productItem);
              return (
                <AdminProductTile
                  key={productItem.id || index}
                  product={productItem}
                />
              );
            })
          : console.log("No products to display")}
      </div>

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
              uploadImageUrl={uploadedImageUrl}
              setUploadImageUrl={setUploadedImageUrl} // Updated prop name
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
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
    </>
  );
}

export default AdminProducts;
