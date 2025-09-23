import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "../../../store/shop/product-slice";
import { Label } from "../ui/label";
import StarRating from "../common/star-rating";
import { addReview, getReviews } from "../../../store/shop/review-slice";
import { useToast } from "@/hooks/use-toast";
// import { useToast } from "@/hooks/use-toast";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);
  console.log(reviews, "reviews");
  // console.log(user, "user");

  const dispatch = useDispatch();

  const { toast } = useToast();

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setReviewMsg("");
    setRating(0);
  }

  function handleRatingChange(getRating) {
    // console.log("Selected rating:", getRating);
    setRating(getRating);
  }

  function handleAddReview() {
    const payload = {
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    };

    // console.log("🚀 Sending review payload:", payload);

    dispatch(addReview(payload)).then((data) => {
      if (data?.payload?.success) {
        // ✅ Review added successfully
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully",
          description: "Thank you for sharing your feedback!",
          className: "bg-green-500 text-white",
        });
        setReviewMsg("");
        setRating(0);
      } else if (
        data?.payload?.message === "You already reviewed this product!"
      ) {
        // ⚠️ Already reviewed
        toast({
          title: "Already reviewed",
          description: "You have already submitted a review for this product.",
          variant: "destructive",
          className: "bg-yellow-400 text-bold text-black",
        });
      } else {
        // ❌ Error case (server or validation)
        toast({
          title: "Error submitting review",
          description:
            data?.payload?.message || "Something went wrong, please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white",
        });
      }
    });
  }

  // Calculate average rating
  const getAverageRating = (reviews = []) => {
    if (!reviews?.length) return 0;
    const total = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0);
    return total / reviews.length;
  };

  const averageRating = getAverageRating(reviews?.data);

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  return (
    <div>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTitle>
          <span className="text-2xl font-bold">Product Details</span>
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
                ${productDetails?.price}
              </p>

              {productDetails?.salePrice > 0 && (
                <p className="text-2xl font-bold text-muted-foreground">
                  ${productDetails?.salePrice}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <StarRating styleGap="gap-0" rating={averageRating} />
              <span className="text-muted-foreground">
                ({averageRating.toFixed(1)})
              </span>
            </div>

            <div className="mt-5 mb-5">
              <Button
                disabled={productDetails?.totalStock === 0}
                className={`${
                  productDetails?.totalStock === 0
                    ? "cursor-not-allowed opacity-60 w-full bg-black/90 text-white"
                    : "w-full bg-black/90 text-white cursor-pointer"
                }`}
                onClick={() => handleAddToCart(productDetails?._id)}
              >
                {" "}
                {productDetails?.totalStock === 0
                  ? "Out of Stock"
                  : "Add to cart"}
              </Button>
            </div>

            <Separator />

            <div className="max-h-[250px] overflow-auto p-5">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>

              <div className="grid gap-6">
                {reviews?.data && reviews.data.length > 0 ? (
                  reviews.data.map((reviewItem) => (
                    <div key={reviewItem._id} className="flex gap-4">
                      <Avatar>
                        <AvatarFallback className="shadow bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
                          {reviewItem?.userName[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">
                            {reviewItem?.userName[0].toUpperCase() +
                              reviewItem?.userName.slice(1)}
                          </h3>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <StarRating rating={reviewItem?.reviewValue} />
                        </div>

                        <p className="text-muted-foreground font-bold">
                          {reviewItem?.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No reviews</h1>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Label>Write a review</Label>
                <div className="flex mt-3 mb-3">
                  <StarRating
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>

                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Write a review..."
                />

                <Button
                  disabled={reviewMsg.trim() === "" || rating === 0}
                  onClick={handleAddReview}
                  className="bg-black text-white mt-4"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductDetailsDialog;
