"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*           User Controller          */
/* ---------------------------------- */

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
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

    // User can see only his data
    // Staff and Admin can see every user's data
    const customFilters =
      req.user?.isAdmin || req.user?.isStaff ? {} : { _id: req.user._id };

    const data = await res.getModelList(User, customFilters);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User, customFilters),
      data,
    });
  },

  create: async (req, res) => {
    /*
          #swagger.tags = ["Users"]
          #swagger.summary = "Create User"
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              schema: {
                  "username": "test",
                  "password": "1234",
                  "email": "test@site.com",
                  "firstName": "test",
                  "lastName": "test",
              }
          }
      */

    // By new account => admin/staff = false
    req.body.isStaff = false;
    req.body.isAdmin = false;

    const data = await User.create(req.body);

    const tokenData = await Token.create({
      userId: data._id,
      token: passwordEncrypt(data._id + Date.now()),
    });

    res.status(201).send({
      error: false,
      message: "New account successfully created!",
      token: tokenData.token,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */

    //

    // Users can see only his data
    // Staff and Admin can see every user's data
    const customFilters =
      req.user?.isAdmin || req.user?.isStaff ? {} : { _id: req.user._id };

    const data = await User.findOne(customFilters);

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "firstName": "test",
                    "lastName": "test",
                }
            }
        */
    console.log("--->>", req.params.id, req.user?.isAdmin);

    // User can update only his data
    // Admin can update , whatever he wants
    const customFilters = req.user?.isAdmin
      ? { _id: req.params.id }
      : { _id: req.user._id };
    // const customFilters = { _id: req.params.id };

    // By updating, the status of admin/staff can not be changed
    if (!req.user?.isAdmin) {
      delete req.body.isStaff;
      delete req.body.isAdmin;
    }

    const data = await User.updateOne(customFilters, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      message: "Account informations successfully updated!",
      data,
      new: await User.findOne(customFilters),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */

    // Permission middleware allows only admin to delete user accounts. Users can not delete their accounts. Only admin can do it

    if (req.params.id !== req.user._id) {
      const data = await User.deleteOne({ _id: req.params.id });

      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        message: data.deletedCount
          ? "Account successfully deleted!"
          : "Account not found!",
        data,
      });
    } else {
      // Admin cannot delete itself
      res.errorStatusCode = 403;
      throw new Error("You can not remove your account.");
    }
  },
};
