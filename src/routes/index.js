"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*            Global Routes           */
/* ---------------------------------- */

const router = require("express").Router();
/* -------------------------------------------- */

// URL: /

router.use("/auth", require("./auth"));
router.use("/users", require("./user"));
router.use("/tokens", require("./token"));
router.use("/brands", require("./brand"));
router.use("/categories", require("./category"));
router.use("/firms", require("./firm"));
router.use("/products", require("./product"));
router.use("/purchases", require("./purchase"));
router.use("/sales", require("./sale"));

// document:
router.use("/documents", require("./document"));

/* -------------------------------------------- */
module.exports = router;
