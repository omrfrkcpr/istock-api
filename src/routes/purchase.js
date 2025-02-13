"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*           Purchase Routes          */
/* ---------------------------------- */
const router = require("express").Router();
/* ------------------------------------------- */

const purchase = require("../controllers/purchase");
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");

// URL: /purchases

router
  .route("/(:id)?")
  // .all(idValidation)
  .post(permissions.isAdmin, purchase.create)
  .get(permissions.isStaff, purchase.read)
  .put(permissions.isAdmin, purchase.update)
  .patch(permissions.isAdmin, purchase.update)
  .delete(permissions.isAdmin, purchase.delete);

/* ------------------------------------------- */
module.exports = router;
