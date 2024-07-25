"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*             Brand Model            */
/* ---------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* -------------------------------------------- */

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    image: String,
  },
  {
    collection: "brands",
    timestamps: true,
  }
);

/* -------------------------------------------- */
module.exports = mongoose.model("Brand", BrandSchema);
