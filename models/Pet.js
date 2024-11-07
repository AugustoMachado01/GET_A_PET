const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model(
  "Pet",
  new Schema(
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      weight: { type: Number, required: true },
      color: { type: String, required: true },
      available: { type: Boolean },
      user: Object,
      adopter: Object,
    },
    { timestamps: true }
  )
);

module.exports = User;
