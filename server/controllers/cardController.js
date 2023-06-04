const Card = require("../models/cardModel");
const { SchemaTypes } = require("mongoose");
const User = require("../models/userModel");

const handleErrors = (err) => {
  let errors = { card: "" };

  if (err.message === "incorrect card number") {
    errors.card = "Error during card creation";
  }

  if (err.code === 11000) {
    errors.email = "Card already created";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
module.exports.addCard = async (req, res) => {
  const { cartItem } = req.body;
  console.log(cartItem);
  try {
    const newCard = await Card.create({
      lanes: cartItem.lanes,
      when: cartItem.when,
      date: new Date(),
      people: 1,
      shoes: cartItem.shoes,
      name: "1",
    });
    const savedCard = await newCard.save();

    if (savedCard) {
      res.status(200).send(savedCard);
    } else {
      throw new Error("No user found");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).send({ message: err.message });
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
module.exports.setCurrentCard = async (req, res) => {
  const { userId, currentCard } = req.body;
  try {
    const user = await User.updateOne({ _id: userId }, { currentCard });
    res.status(200).send(user.currentCard);
  } catch (err) {
    throw new Error({ message: err.message });
  }
};
module.exports.deleteCard = async (req, res) => {
  const { userId, cartItem } = req.body;

  try {
    await Card.findByIdAndRemove({ user: userId, _id: cartItem });
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ message: "Couldn`t delete the user" });
  }
};
