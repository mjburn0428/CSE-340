/* ***********************************
 * Account Routes
 * Unit 4, deliver login view activity
 * ********************************* */

// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Default account route
router.get(
  "/",utilities.checkLogin,utilities.handleError(accountController.buildAccountHome)
);

// Route when login button is clicked
router.get("/login", utilities.handleError(accountController.buildLogin));

// Handle registration post request
router.post(
  "/register",regValidate.registrationRules(),regValidate.checkRegData,utilities.handleError(accountController.registerAccount)
);

// Registration route
router.get("/register", utilities.handleError(accountController.buildRegister));

// Process the login attempt
router.post(
  "/login",regValidate.loginRules(),regValidate.checkLoginData,utilities.handleError(accountController.accountLogin)
);

// Account Management route
router.get(
  "/manage",utilities.checkLogin,utilities.handleError(accountController.buildManageAccount)
);

// Account Update route
router.get("/update/:id", utilities.checkLogin,utilities.handleError(accountController.buildAccountUpdate)
);

// Handle account update post request
router.post(
  "/update",utilities.checkLogin,regValidate.updateAccountRules(),regValidate.checkUpdateAccountData,utilities.handleError(accountController.updateAccount)
  );

// Change Password route
router.post("/change-password",utilities.checkLogin,regValidate.changePasswordRules(),regValidate.checkChangePasswordData,utilities.handleError(accountController.changePassword)
);

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/account/login");
});

module.exports = router;
