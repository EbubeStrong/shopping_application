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
  deleteProduct,
  editProduct,
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Renamed for clarity
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  // a way for passing of props through / when using Outlet
  const { openCreateProductsDialog, setOpenCreateProductsDialog } =
    useOutletContext();

  const productList = useSelector(
    (state) => state.adminProducts.productList.data || []
  );

  // console.log('productList', productList)

  const dispatch = useDispatch();
  const { toast } = useToast();

  async function onSubmit(e) {
    e.preventDefault();

    if (currentEditedId !== null) {
      try {
        const result = await dispatch(
          editProduct({ id: currentEditedId, formData })
        ).unwrap();

        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setFormData(initialFormData);

        toast({
          title: "Success",
          description: "Product edited successfully",
          variant: "default",
          className: "bg-white",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error?.message || "Error editing product",
          variant: "destructive",
          className: "bg-red-700",
        });
      }
    } 
    // else {
    //   if (!uploadedImageUrl) {
    //     toast({
    //       title: "Error",
    //       description: "Please upload an image before submitting",
    //       variant: "destructive",
    //       className: "bg-red-700",
    //     });
    //     return;
    //   }

    //   try {
    //     console.log("Submitting form:", formData, uploadedImageUrl);
    //     const result = await dispatch(
    //       addNewProduct({ ...formData, image: uploadedImageUrl })
    //     ).unwrap();

    //     dispatch(fetchAllProducts());
    //     setOpenCreateProductsDialog(false);
    //     setFormData(initialFormData);
    //     // setImageFile(null);
    //     setImageFile(null);
    //     setUploadedImageUrl(product?.image || null); // 👈 preload product image

    //     toast({
    //       title: "Success",
    //       description: "Product added successfully",
    //       variant: "default",
    //       className: "bg-white",
    //     });
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: error?.message || "Error adding product",
    //       variant: "destructive",
    //       className: "bg-red-700 text-white",
    //     });
    //   }
    // }

    else {
      if (!uploadedImageUrl) {
        toast({
          title: "Error",
          description: "Please upload an image before submitting",
          variant: "destructive",
          className: "bg-red-700",
        });
        return;
      }
    
      try {
        console.log("Submitting form:", formData, uploadedImageUrl);
    
        const result = await dispatch(
          addNewProduct({ ...formData, image: uploadedImageUrl })
        ).unwrap();
    
        if (result) {
          await dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setImageFile(null);
    
          toast({
            title: "Success",
            description: "Product added successfully",
            variant: "default",
            className: "bg-green-600 text-white", // ✅ better feedback
          });
        }
      } catch (error) {
        console.error("Error adding product:", error);
    
        toast({
          title: "Error",
          description: error?.message || "Failed to add product. Try again.",
          variant: "destructive",
          className: "bg-red-700 text-white",
        });
      }
    }
    
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  const handleDelete = (getCurrentProduct) => {
    console.log("Deleting product with id:", getCurrentProduct);
    dispatch(deleteProduct(getCurrentProduct)).then((data) => {
      // console.log(data, "delete product")
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Success",
          description: "Product deleted successfully",
          variant: "default",
          className: "bg-white",
        });
      }
    });
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // console.log(productList, "productList");

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 px-5 ">
        {productList &&
          productList.length > 0 &&
          productList.map((productItem, index) => {
            // console.log("Rendering product:", productItem);
            return (
              <AdminProductTile
                key={productItem.id || index}
                product={productItem}
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setFormData={setFormData}
                handleDelete={handleDelete}
              />
            );
          })}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>

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
              isEditMode={currentEditedId !== null}
            />
          </SheetHeader>

          <div className="py-6">
            <CommonForm
              formData={formData}
              formControls={addProductFormElements}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AdminProducts;
