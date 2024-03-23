const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Process Account Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      messages: req.flash(),
    });
    return;
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      messages: req.flash(),
    });
  }
}

/* ****************************************
 *  Process Login Request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: req.flash(),
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Build Account Home
 * *************************************** */
async function buildAccountHome(req, res) {
  console.log("\nbuilding account home\n");
  let nav = await utilities.getNav();
  req.flash("notice", "You are logged in.");
  res.render("account/account-home", {
    title: "Account Home",
    nav,
    errors: null,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Build Manage Account
 * *************************************** */
async function buildManageAccount(req, res) {
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountByEmail(
    res.locals.accountData.account_email
  );

  if (!accountData) {
    req.flash("notice", "Account not found.");
    res.status(404).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash(),
    });
    return;
  }

  res.render("account/account-manage", {
    title: "Manage Account",
    nav,
    errors: null,
    account: accountData,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Deliver Account Update View
 * *************************************** */
async function buildAccountUpdate(req, res) {
  let nav = await utilities.getNav();

  res.render("account/account-update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData: res.locals.accountData, // pass accountData to the view
    messages: req.flash(),
  });
}

/* ****************************************
 *  Handle Account Update
 * *************************************** */
async function updateAccount(req, res) {
  console.log("\nupdating account\n");
  let nav = await utilities.getNav();
  const { account_id } = res.locals.accountData;

  // Get updated data from form
  const { account_firstname, account_lastname, account_email } = req.body;

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (result) {
    req.flash("notice", "Account updated successfully.");
  } else {
    req.flash("notice", "Account update failed.");
  }

  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/account-manage", {
    title: "Manage Account",
    nav,
    errors: null,
    account: accountData,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Handle Password Change
 * *************************************** */
async function changePassword(req, res) {
  console.log("\nchanging password\n");
  let nav = await utilities.getNav();
  const { account_id, password } = res.locals.accountData;

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await accountModel.changePassword(account_id, hashedPassword);

  if (result) {
    req.flash("notice", "Password changed successfully.");
  } else {
    req.flash("notice", "Password change failed.");
  }

  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/account-manage", {
    title: "Manage Account",
    nav,
    errors: null,
    account: accountData,
    messages: req.flash(),
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountHome,
  buildManageAccount,
  buildAccountUpdate,
  updateAccount,
  changePassword,
};
