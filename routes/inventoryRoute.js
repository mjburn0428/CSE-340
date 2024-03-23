// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleError(invController.buildByClassificationId)
);

// Route for detail view
router.get("/detail/:inv_id", utilities.handleError(invController.buildById));

// Route for inv management
router.get("/", utilities.checkAdmin, (req, res, next) => {
  utilities.handleError(invController.buildManageInventory)(req, res, next);
});

// Route for add classification page
router.get("/add-classification", utilities.checkAdmin, (req, res, next) => {
  utilities.handleError(invController.buildAddClassification)(req, res, next);
});

// Route for getInventory
router.get("/getInventory/:classification_id",utilities.handleError(invController.getInventoryJSON)
);

// Handle add classification post request
router.post("/add-classification",invValidate.classificationRules(),invValidate.checkClassificationData,utilities.handleError(invController.addClassification)
);

// Route for add inventory page
router.get("/add-inventory", utilities.checkAdmin, (req, res, next) => {utilities.handleError(invController.buildAddInventory)(req, res, next);
});

// Handle add inventory request
router.post("/add-inventory",invValidate.inventoryRules(),invValidate.checkInventoryData,utilities.handleError(invController.addInventory)
);

// Route for inventory modification
router.get("/edit/:inv_id",utilities.checkAdmin,utilities.handleError(invController.buildInvEdit)
);

// Handle inventory modification post request
router.post("/edit-inventory",invValidate.inventoryRules(),invValidate.checkUpdateData,utilities.handleError(invController.updateInventory)
);

// Route for delete inventory
router.get("/delete/:inv_id",utilities.checkAdmin,utilities.handleError(invController.buildDeleteConfirmation)
);

// Handle delete inventory post request
router.post("/delete-inventory",utilities.handleError(invController.deleteInventory)
);

module.exports = router;
