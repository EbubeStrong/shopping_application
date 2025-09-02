const Product = require("../../models/products");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      brand = [],
      sortBy = "price-low-to-high",
    } = req.query;

    let filters = {}

    if(category.length){
      filters.category = { $in: category.split(',') }
    }

    if(brand.length){
      filters.brand = { $in: brand.split(',') }
    }

    let sort = {}

    switch (sortBy) {
      case 'price-low-to-high':
        sort.price = 1

        break;

      case 'price-high-to-low':
        sort.price = -1

        break;
      
      case 'title-a-to-z':
        sort.title = 1

        break;
       
      case 'title-z-to-a':
        sort.title = -1

        break;

      default:
        sort.price = 1
        break;
      
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred filtrating products",
    });
  }
};


const getProductDetails = async(req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findById(id)

    if(!product) return res.status(404).json({
      success: false,
      message: 'Product not found'
    })

    res.status(200).json({
      success: true,
      data: product
    })

  }catch(e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured getting product",
    });
  }
}

module.exports = { getFilteredProducts,  getProductDetails };
