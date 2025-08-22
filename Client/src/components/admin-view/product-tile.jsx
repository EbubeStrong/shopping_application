import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function AdminProductTile({
  product,
  setCurrentEditedId,
  setOpenCreateProductsDialog,
  setFormData,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl mt-2 font-bold mb-2">{product?.title}</h2>

          <div className="flex justify-between mb-2 items-center">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? <span>${product?.salePrice}</span> : null}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setCurrentEditedId(product?._id);
              setFormData(product);
              // preload current image into upload preview and clear any prior selection
              if (typeof window !== 'undefined') {
                try {
                  // When editing, we expect parent to have setters in closure
                  // We can signal via custom event so parent can sync image states
                  const evt = new CustomEvent('admin-edit-product-image', { detail: { image: product?.image || null } });
                  window.dispatchEvent(evt);
                } catch (_) {}
              }
              setOpenCreateProductsDialog(true);
            }}
            className="bg-black/90 text-white"
            >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product?._id)} 
            className="bg-black/90 text-white"
            >Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
