"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*             User Model             */
/* ---------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const passwordEncrypt = require("../helpers/passwordEncrypt");
/* --------------------------------------- *
{
    "username": "test",
    "password": "aA?123456",
    "email": "test@site.com",
    "firstName": "test",
    "lastName": "test",
    "isActive": true,
    "isStaff": false,
    "isAdmin": false
}
------------------------------------------ */

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      // pre-middleware (save) takes care of validation and encryption of password...
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
      // pre-middleware (save) takes care of validation of email...
    },

    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

/* ------------------------------------------- */
// https://mongoosejs.com/docs/middleware.html

UserSchema.pre(["save", "updateOne"], function (next) {
  const data = this?._update || this;
  // console.log("this >> ", data);
  // console.log("pre(save) run.");

  // email@domain.com
  const isEmailValidated = data.email
    ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
    : true;
  console.log("email control", isEmailValidated);

  if (isEmailValidated) {
    if (data?.password) {
      // kalitenizi gösterir
      const isPasswordValidated =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
          data.password
        );

      if (isPasswordValidated) {
        data.password = passwordEncrypt(data.password);

        console.log("password Encrypt >> ", data.password);

        if (this?._update) {
          this._update = data;
        } else {
          this.password = data.password;
        }
      } else {
        next(new Error("Password is not validated."));
      }
    }
    next();
  } else {
    next(new Error("Email is not validated."));
  }
});

/* ---------------------------------------- */
module.exports = mongoose.model("User", UserSchema);
