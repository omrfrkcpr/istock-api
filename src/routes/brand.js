"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*            Brand Routes            */
/* ---------------------------------- */
const router = require("express").Router();
/* ------------------------------------------- */

const brand = require("../controllers/brand");
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");

// URL: /brands

router
  .route("/(:id)?")
  // .all(idValidation)
  .post(permissions.isAdmin, brand.create)
  .get(permissions.isStaff, brand.read)
  .put(permissions.isAdmin, brand.update)
  .patch(permissions.isAdmin, brand.update)
  .delete(permissions.isAdmin, brand.delete);

/* ------------------------------------------- */
module.exports = router;
