const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/*  **********************************
 *  Adds Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name."),

    body("classification_name")
      .trim()
      .isAlpha()
      .withMessage(
        "Classification name must contain only alphabetic characters."
      ),
  ];
};

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  const { classification_name } = req.body;

  // if there are errors, send back with error messages
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
      messages: req.flash(),
    });
  }

  
  next();
};

/*  **********************************
 *   Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model name."),

    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid 4-digit year.")
      .isNumeric()
      .withMessage("Year must contain only numeric characters."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image.")
      .matches(/\.(jpg|jpeg|png|webp)$/i)
      .withMessage("Image must be a .jpg, .jpeg, .png, or .webp file."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail.")
      .matches(/\.(jpg|jpeg|png|webp)$/i)
      .withMessage("Thumbnail must be a .jpg, .jpeg, .png, or .webp file."),

    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a price.")
      .toFloat() 
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide the mileage.")
      .toInt() 
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color.")
      .matches(/^[a-zA-Z\s-]*$/)
      .withMessage(
        "Color must contain only alphabetic characters, spaces, and hyphens."
      ),

    body("classification_id")
      .isLength({ min: 1 })
      .withMessage("Please provide a classification ID.")
      .isInt()
      .withMessage("Please select a valid classification ID."),
  ];
};

/* ******************************
 * Check new inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const {inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id} = req.body;

  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let dropdown = await utilities.buildDropdown();
    return res.render("./inventory/add-inventory", {
      title: "Add Inventory",nav,dropdown,errors,
      messages: req.flash(),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }

  
  next();
};

/* ******************************
 * Check update data and continue to db if valid, return to edit if not
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  const {inv_id,inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id,} = req.body;

  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let dropdown = await utilities.buildDropdown();
    return res.render("./inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,dropdown,errors,
      messages: req.flash(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }

  
  next();
};

module.exports = validate;

