"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*         Purchase Controller        */
/* ---------------------------------- */

const Purchase = require("../models/purchase");
const Product = require("../models/product");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "List Purchases"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */
    const data = await res.getModelList(Purchase, {}, [
      { path: "userId", select: "username email" },
      { path: "firmId", select: "name image" },
      "brandId",
      { path: "productId", select: "productId name categoryId" },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelsListDetails(Purchase),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Create Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Purchase 1"
                }
            }
        */

    // take userId from req.user
    req.body.userId = req.user._id;

    const data = await Purchase.create(req.body);

    // After purchase update quantity (+)
    const updateProduct = await Product.updateOne(
      { _id: data.productId },
      { $inc: { quantity: +data.quantity } }
    );

    res.status(201).send({
      error: false,
      message: "New Purchase completed successfully!",
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Get Single Purchase"
        */

    // console.log("read run");

    if (req.params.id) {
      // Single

      const data = await Purchase.findOne({ _id: req.params.id }).populate([
        { path: "userId", select: "username email" },
        { path: "firmId", select: "name image" },
        "brandId",
        { path: "productId", select: "productId name categoryId" },
      ]);

      res.status(200).send({
        error: false,
        data,
      });
    } else {
      // All

      const data = await res.getModelList(Purchase, {}, [
        { path: "userId", select: "username email" },
        { path: "firmId", select: "name image" },
        "brandId",
        { path: "productId", select: "productId name categoryId" },
      ]);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Purchase),
        data,
      });
    }
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Update Purchase"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Purchase 1"
                }
            }
        */

    if (req.body?.quantity) {
      // get current purchase data
      const currentPurchase = await Purchase.findOne({ _id: req.params.id });
      // find difference
      const difference = req.body.quantity - currentPurchase.quantity;
      // update the product quantity with the difference amount (+)
      const updateProduct = await Product.updateOne(
        { _id: currentPurchase.productId },
        { $inc: { quantity: +difference } }
      );
    }

    // Update
    const data = await Purchase.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      message: "Purchase updated successfully!",
      data,
      new: await Purchase.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Purchases"]
            #swagger.summary = "Delete Purchase"
        */

    // get current purchase data
    const currentPurchase = await Purchase.findOne({ _id: req.params.id });

    // Delete
    const data = await Purchase.deleteOne({ _id: req.params.id });

    // After delete, update product quantity (-)
    const updateProduct = await Product.updateOne(
      { _id: currentPurchase.productId },
      { $inc: { quantity: -currentPurchase.quantity } }
    );

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Purchase successfully deleted!"
        : "Purchase not found!",
      data,
    });
  },
};
