const router = require("express").Router();
const commentCtrl = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/getComments/:id", commentCtrl.getComments);
router.put("/updateComment/:id", commentCtrl.updateStatus);
router.get("/getComments", commentCtrl.getAllComments);
router.get("/getStartComments/:id", commentCtrl.getStarComment);
router.delete("/deleteComment/:id", commentCtrl.deleteComment);
module.exports = router;
