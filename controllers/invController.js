const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invCont = {}


/* ***************************************
 *  Build inventory by classification view
 * ************************************ */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/*******************************
 * Build inventory by inv view
 *******************************/
invCont.buildByModelId = async function (req, res, next) {
  const model_id = req.params.inventoryId
  const data = await invModel.getModelById(model_id)
  const grid = await utilities.buildModelGrid (data)
  let nav = await utilities.getNav()
  const vehicle = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/inventory.ejs", { title: vehicle, nav, grid,})
}

/* **********************
 *  Build Management View
 * ******************* */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {title: "CSE Motors Vehicle Management Menu", nav, errors: null,})
}

/* ******************************
 *  Build add-classification view
 * *************************** */
invCont.BuildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {title: "Add Classification Type", nav, errors: null,})
}
/* *************************
 *  Build add-inventory view
 * ********************** */
invCont.BuildAddInventory = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  let nav = await utilities.getNav();
  let selectList = await utilities.getClassifications();
  res.render("./inventory/add-inventory", {title: "Add Inventory", nav, selectList, errors: null,})
}

/* ********************
 *  Adds Classification
 * ***************** */
invCont.AddNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { add_classification } = req.body;

  const classResult = await invModel.addClassification(add_classification);
  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve created the ${add_classification} classification!`,
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, that classification did not work. Please try again",
    );
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
  Add Inventory to Database
 * ************************** */
invCont.AddNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
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
  } = req.body;

  const invResult = await invModel.addInventory(
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
  );

  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_make} ${inv_model} to the inventory!\n`,
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, there was an issue adding a new vehicle. Please try again.",
    );
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    });
  }
};

module.exports = invCont;