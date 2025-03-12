import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import { Fragment } from "react";

function ProductFilter() {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>

      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((options, index) => (
                  <Label
                    key={index}
                    className="flex items-center gap-2 font-medium"
                  >
                    {" "}
                    {/* ✅ Add key for inner map */}
                    <Checkbox />
                    {options.label}
                  </Label>
                ))}
              </div>
            </div>

            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
