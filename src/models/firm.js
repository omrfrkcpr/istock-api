"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*             Firm Model             */
/* ---------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------- */

const FirmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    phone: String,

    address: String,

    image: String,
  },
  {
    collection: "firms",
    timestamps: true,
  }
);

/* ------------------------------------------- */
module.exports = mongoose.model("Firm", FirmSchema);
