const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProducts,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct)
router.post("/edit/:id", editProduct)
router.post("/delete/:id", deleteProduct)
router.get("/get", fetchAllProducts)

module.exports = router;
