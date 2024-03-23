const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
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

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildById = async function (req, res, next) {
  // get inventory id from params
  const inventory_id = req.params.inv_id;

  // get specific vehicle data
  const vehicleDetails = await invModel.getInventoryItemById(inventory_id);

  // in case vehicle isn't found
  if (!vehicleDetails) {
    return res.status(404).send("Vehicle not found");
  }

  const nav = await utilities.getNav();
  const detailView = await utilities.buildDetailView(vehicleDetails);

  // render detail view
  res.render("./inventory/detail", {
    title: vehicleDetails.inv_make + " " + vehicleDetails.inv_model,
    nav,
    detailView,
    messages: req.flash(),
  });
};

/* ***************************
 *  Build inv management view
 * ************************** */
invCont.buildManageInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildDropdown();

  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    classificationSelect,
    errors: null,
    messages: req.flash(),
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: req.flash(),
  });
};

/* ***************************
 *  Process adding new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const addClassificationResult = await invModel.addClassification(
    classification_name
  );

  if (addClassificationResult) {
    req.flash(
      "notice",
      `New Classification ${classification_name} added successfully.`
    );
    res.redirect("/inv");
  } else {
    req.flash(
      "error",
      `Sorry, there was an error adding the ${classification_name} as a new class.`
    );
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      messages: req.flash(),
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildDropdown();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    dropdown,
    errors: null,
    messages: req.flash(),
  });
};

/* ***************************
 *  Process adding new inventory item
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildDropdown();

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

  const addInventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addInventoryResult) {
    req.flash(
      "notice",
      `${inv_make} ${inv_model} added to inventory successfully.`
    );
    res.redirect("/inv");
  } else {
    req.flash(
      "error",
      `Sorry, there was an error adding the ${inv_make} ${inv_model} to the inventory.`
    );
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown,
      errors: null,
      messages: req.flash(),
    });
  }
};

/* ***************************
 *  Build error view
 * ************************** */
invCont.buildError = async function (req, res, next) {
  const error = new Error("Server Error");
  error.status = 500;
  throw error;
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    console.log("INV DATA FROM getJSON: ", invData);
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 * Build Edit Inventory View
 * ************************** */
invCont.buildInvEdit = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryItemById(inv_id);
  console.log("DATA FROM buildInvEdit: ", data);
  let dropdown = await utilities.buildDropdown();
  res.render("./inventory/edit-inventory", {
    title: `Edit ${data.inv_make} ${data.inv_model}`,
    nav,
    dropdown,
    errors: null,
    messages: req.flash(),
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id,
  });
};

/* ***************************
 * Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildDropdown();

  const {
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
  } = req.body;

  const updateInventoryResult = await invModel.updateInventory(
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
    classification_id
  );

  if (updateInventoryResult) {
    req.flash("notice", `${inv_make} ${inv_model} updated successfully.`);
    res.redirect("/inv");
  } else {
    req.flash(
      "error",
      `Sorry, there was an error updating the data for ${inv_make} ${inv_model}.`
    );
    res.status(501).render("inventory/edit-inventory", {
      title: "Update Inventory",
      nav,
      dropdown,
      errors: null,
      messages: req.flash(),
    });
  }
};

/* ***************************
 *  Build Delete Confirmation Page
 * ************************** */
invCont.buildDeleteConfirmation = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryItemById(inv_id);
  let name = `${data.inv_make} ${data.inv_model}`; // name variable to hold the inventory item's make and model
  res.render("./inventory/delete-confirm", {
    title: `Delete ${name}`,
    nav,
    errors: null,
    messages: req.flash(),
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
  });
};

/* ***************************
 * Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav();

  const { inv_make, inv_model } = req.body;
  const inv_id = parseInt(req.body.inv_id);

  const deleteInventoryResult = await invModel.deleteInventory(inv_id);

  if (deleteInventoryResult) {
    req.flash("notice", `${inv_make} ${inv_model} deleted successfully.`);
    res.redirect("/inv");
  } else {
    req.flash(
      "error",
      `Sorry, there was an error deleting the data for ${inv_make} ${inv_model}.`
    );
    res.status(501).redirect(`/inv/delete-confirm/${inv_id}`);
  }
};

module.exports = invCont;
