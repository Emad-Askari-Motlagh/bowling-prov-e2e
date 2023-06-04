const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  lanes: {
    type: Number,
  },
  when: {
    type: String,
  },
  date: {
    type: mongoose.SchemaTypes.Date,
    required: [true, "Date is required"],
  },
  people: {
    type: Number,
    required: [true, "People numbers is Required"],
  },
  shoes: {
    type: mongoose.SchemaTypes.Array,
  },
});

module.exports = mongoose.model("cards", cardSchema);
