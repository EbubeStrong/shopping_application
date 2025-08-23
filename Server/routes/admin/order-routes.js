const express = require("express");

const {
    getAllOrdersOfAllUsers,
    getAllOrderDetailsForAdmin,
    updateOrderStatus
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers)
router.get("/details/:id", getAllOrderDetailsForAdmin)
router.put("/update-status/:id", updateOrderStatus)


module.exports = router;
