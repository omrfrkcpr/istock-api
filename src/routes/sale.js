"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*             Sale Routes            */
/* ---------------------------------- */
const router = require("express").Router();
/* ----------------------------------------- */

const sale = require("../controllers/sale");
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");

// URL: /sales

router
  .route("/(:id)?")
  // .all(idValidation)
  .post(permissions.isAdmin, sale.create)
  .get(permissions.isStaff, sale.read)
  .put(permissions.isAdmin, sale.update)
  .patch(permissions.isAdmin, sale.update)
  .delete(permissions.isAdmin, sale.delete);

/* ----------------------------------------- */
module.exports = router;
