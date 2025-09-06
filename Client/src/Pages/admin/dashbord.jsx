import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "../../../store/common-slice/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();

  const { featureImageList } = useSelector((state) => state.commonFeature);

//   console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

    function handleDeleteFeatureImage(id) {
        console.log("Delete feature image with id:", id);
        // Implement the delete functionality here
        dispatch(deleteFeatureImage(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages());
            }
        });
    }

//   console.log(featureImageList, "featureImageList");

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadImageUrl={uploadedImageUrl}
        setUploadImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        adminDashboardStyling={true}
        // isEditMode={currentEditedId !== null}

        
      />
      <Button
      onClick={handleUploadFeatureImage} className="mt-5 w-full bg-black/80 text-white hover:bg-black/90 cursor-pointer">
        Upload
      </Button>

      {/* <div className="relative flex items-center justify-center mt-5 overflow-auto h-[500px] border rounded-lg">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
            <> 
              <div className="w-[40%] h-[100%] rounded-2xl  flex items-center justify-center" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                //   alt={featureImgItem.image}
                  className="w-[90%] h-[100%] md:h-[90%] object-filled z-10"
                />
              </div>

              <Button onClick={() => handleDeleteFeatureImage(featureImgItem._id)} className="bg-red-500 text-white rounded-md px-2 py-1">
                Delete
              </Button>
             </>
            ))
          : null}
      </div> */}

      <div className="relative flex  mt-5 overflow-auto h-[500px] rounded-lg py-5">
  {featureImageList && featureImageList.length > 0
    ? featureImageList.map((featureImgItem) => (
        <div
          key={featureImgItem._id}
          className="relative w-[40%] h-[100%] rounded-2xl flex flex-col items-center p-3 m-2 border"
        >
          <img
            src={featureImgItem.image}
            alt=""
            className="w-[100%] h-[100%] md:h-[90%] object-filled z-10 rounded-2xl"
          />
          <Button
            onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
            className=" bg-red-500 text-white rounded-md w-full mt-3 cursor-pointer px-2 py-1"
          >
            Delete
          </Button>
        </div>
      ))
    : null}
</div>

    </div>
  );
}

export default AdminDashboard;