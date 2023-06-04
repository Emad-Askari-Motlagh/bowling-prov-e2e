const {
  addCard,
  getCards,
  setCurrentCard,
  deleteCard,
} = require("../controllers/cardController");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/api/cards", getCards);
router.post("/api/cards/add", addCard);
router.post("/api/cards/delete", deleteCard);
module.exports = router;
