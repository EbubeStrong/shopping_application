import { Input } from "../ui/input";
import { Label } from "../ui/label";


function ProductImageUpload() {
    return ( 
        <div className="w-full max-w-md mx-auto">
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

            <div>
                <Input id="image-upload" type="file" className="hidden"/>
            </div>
        </div>
     );
}

export default ProductImageUpload;