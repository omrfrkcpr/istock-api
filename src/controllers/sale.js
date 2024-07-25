"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*           Sale Controller          */
/* ---------------------------------- */

const Sale = require("../models/sale");
const Product = require("../models/product");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "List Sales"
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
    const data = await res.getModelList(Sale, {}, [
      { path: "userId", select: "username email" },
      "brandId",
      { path: "productId", select: "productId name categoryId" },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelsListDetails(Sale),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Create Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Sale 1"
                }
            }
        */

    // get userId from req.user
    req.body.userId = req.user._id;

    const productData = await Product.findOne({ _id: req.body.productId });

    // if quantity of product is equal or greater than requested amount, than perform it!
    if (productData.quantity >= req.body.quantity) {
      const data = await Sale.create(req.body);

      // After Sale, update product quantity (-)
      await Product.updateOne(
        { _id: data.productId },
        { $inc: { quantity: -data.quantity } }
      );

      res.status(201).send({
        error: false,
        message: "New Sale completed successfully!",
        data,
      });
    } else {
      res.errorStatusCode = 422;
      throw new Error(
        `There is not enough product-quantity for this sale. This product's stock is ${productData.quantity}!`
      );
    }
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Get Single Sale"
        */

    // console.log("read run");

    if (req.params.id) {
      const data = await Sale.findOne({ _id: req.params.id }).populate([
        { path: "userId", select: "username email" },
        "brandId",
        { path: "productId", select: "productId name categoryId" },
      ]);

      res.status(200).send({
        error: false,
        data,
      });
    } else {
      // All
      const data = await res.getModelList(Sale, {}, [
        { path: "userId", select: "username email" },
        "brandId",
        { path: "productId", select: "productId name categoryId" },
      ]);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Sale),
        data,
      });
    }
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Update Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Sale 1"
                }
            }
        */

    if (req.body?.quantity) {
      // get current sale data
      const currentSale = await Sale.findOne({ _id: req.params.id });
      // find difference
      const difference = req.body.quantity - currentSale.quantity;
      // update the quantity of product with the difference amount (-)
      const updateProduct = await Product.updateOne(
        { _id: currentSale.productId },
        { $inc: { quantity: -difference } }
      );

      if (updateProduct.modifiedCount == 0) {
        res.errorStatusCode = 422;
        throw new Error("There is not enough product-quantity for this sale.");
      }
    }

    // Update
    const data = await Sale.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      message: "Sale successfully updated!",
      data,
      new: await Sale.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Delete Sale"
        */

    // get current sale data
    const currentSale = await Sale.findOne({ _id: req.params.id });

    // Delete
    const data = await Sale.deleteOne({ _id: req.params.id });

    // update the quantity of product (+)
    const updateProduct = await Product.updateOne(
      { _id: currentSale.productId },
      { $inc: { quantity: +currentSale.quantity } }
    );

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Sale successfully deleted!"
        : "Sale not found!",
      data,
    });
  },
};
