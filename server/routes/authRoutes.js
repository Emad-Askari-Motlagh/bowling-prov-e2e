const { register, login, logout } = require("../controllers/authController");
const { setCurrentCard } = require("../controllers/cardController");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/", checkUser);
router.post("/api/auth/signup", register);
router.post("/api/auth/signin", login);
router.get("/api/auth/logout", logout);
router.post("/api/user/setCurrentCard", setCurrentCard);
module.exports = router;
