import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRating({ rating = 0, handleRatingChange, styleGap }) {
  return (
    <div className={"flex " + (styleGap ? styleGap : "gap-1")}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= Math.floor(rating);
        const isHalf = star > Math.floor(rating) && star - rating <= 0.5;

        return (
          <Button
            key={star}
            variant="ghost"
            size="icon"
            className={`p-2 rounded-full transition-colors cursor-pointer border-none group 
                 ${
                   star <= rating
                     ? "text-yellow-500 hover:bg-black"
                     : "text-black hover:bg-black hover:text-white"
                 }
           `}
            onClick={() =>
              handleRatingChange ? handleRatingChange(star) : null
            }
          >
            <StarIcon
              className={`transition-colors ${
                isFull
                  ? "text-yellow-500 fill-yellow-500 group-hover:text-yellow-300"
                  : isHalf
                  ? "text-yellow-500 fill-yellow-500 opacity-50 group-hover:text-yellow-300"
                  : "text-black group-hover:text-white"
              }`}
              style={{ width: "20px", height: "20px" }}
            />
          </Button>
        );
      })}
    </div>
  );
}

export default StarRating;
