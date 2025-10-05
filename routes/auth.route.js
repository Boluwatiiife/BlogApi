const expres = require("express");
const { signup, login } = require("../controllers/auth.con");
const router = expres.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
