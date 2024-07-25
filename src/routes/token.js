"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*            Token Routes            */
/* ---------------------------------- */
const router = require("express").Router();
/* ------------------------------------------ */

const { isAdmin } = require("../middlewares/permissions");
const token = require("../controllers/token");
const idValidation = require("../middlewares/idValidation");

// URL: /tokens

router.use(isAdmin);

router.route("/").get(token.list).post(token.create);

router
  .route("/:id")
  .all(idValidation)
  .get(token.read)
  .put(token.update)
  .patch(token.update)
  .delete(token.delete);

/* ------------------------------------------ */
module.exports = router;
