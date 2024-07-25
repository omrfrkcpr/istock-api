"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*           Category Routes          */
/* ---------------------------------- */
const router = require("express").Router();
/* --------------------------------------------- */

const category = require("../controllers/category");
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");

// URL: /categories

// router.route('/')
//     // .get(permissions.isStaff, category.list)
//     .get(permissions.isStaff, category.read)
//     .post(permissions.isAdmin, category.create)

// router.route('/:id')
//     .all(idValidation)
//     .get(permissions.isStaff, category.read)
//     .put(permissions.isAdmin, category.update)
//     .patch(permissions.isAdmin, category.update)
//     .delete(permissions.isAdmin, category.delete)

router
  .route("/(:id)?")
  .all(idValidation)
  .post(permissions.isAdmin, category.create)
  .get(permissions.isStaff, category.read)
  .put(permissions.isAdmin, category.update)
  .patch(permissions.isAdmin, category.update)
  .delete(permissions.isAdmin, category.delete);

/* -------------------------------------------- */
module.exports = router;
