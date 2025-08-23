const Order = require("../../models/order");


const getAllOrdersOfAllUsers = async(req, res) => {
    try {
  
      const orders = await Order.find({})
  
      if(orders.length === 0){
        return res.status(404).json({
          success: false,
          message: 'No orders found!'
        })
      }
  
      res.status(200).json({
        success: true,
        data: orders
      })
      
    }  catch (error) {
      console.error("Error while getting all PayPal order:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Some error occurred while  getting all PayPal order",
      });
    }
  }

  const getAllOrderDetailsForAdmin = async(req, res) => {
    try {
      const {id} = req.params
  
      const order = await Order.findById(id)
  
      if(!order){
        return res.status(404).json({
          success: false,
          message: 'Order not found!'
        })
      }
  
      res.status(200).json({
        success: true,
        data: order
      })
  
    }  catch (error) {
      console.error("Error while getting all PayPal order details:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Some error occurred while  getting all PayPal order details",
      });
    }
  }

  const updateOrderStatus = async(req, res) => {
    try {
      const {id} = req.params
      const {orderStatus} = req.body

      if (!orderStatus) {
        return res.status(400).json({
          success: false,
          message: 'Order status is required!'
        })
      }

      const order = await Order.findById(id)
  
      if(!order){
        return res.status(404).json({
          success: false,
          message: 'Order not found!'
        })
      }

      const updatedOrder = await Order.findByIdAndUpdate(id, {orderStatus}, {new: true})

      res.status(200).json({
        success: true,
        message: "Order status is updated successfully!",
        data: updatedOrder
      })

    } catch (error) {
      console.error("Error while updating order status:", error)
      res.status(500).json({
        success: false,
        message: 'Some error occurred while updating order status'
      })
    }
  }




  module.exports = {getAllOrdersOfAllUsers, getAllOrderDetailsForAdmin, updateOrderStatus}