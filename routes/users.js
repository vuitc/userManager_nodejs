var express = require("express");
var router = express.Router();
var controler = require("../controllers/user");
/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });
router.get("/", controler.getUsers);
router.get("/:userId", controler.getUsersByID);
router.post("/save", controler.createUser);
router.post("/update", controler.updateUser);
router.get("/delete/:userId", controler.delUserById);
router.post("/checklogin", controler.checkLogin);
module.exports = router;
