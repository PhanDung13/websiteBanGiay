const router = require("express").Router();
const orderCtrl = require("../controllers/orderCtrl");
const { auth } = require("../middleware/auth");

router.post("/order", orderCtrl.createOrder);
router.get("/getAllOrder", orderCtrl.getAllOrder);
router.post("/order/getOrderTT", orderCtrl.getOrderTT);
router.get("/order/:id", orderCtrl.getAllOrderbyId);
router.put("/order/editAderess", orderCtrl.updateAdress);
router.delete("/order/:id", orderCtrl.deleteOrder);
router.put("/order/updateStatus", orderCtrl.updateStatus);
router.put("/order/updateMessage", orderCtrl.updateMessage);

module.exports = router;
