// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { handleErrors} = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId),
  );

  // Route to build inventory view
router.get("/detail/:inventoryId",utilities.handleErrors(invController.buildByModelId),
  );
  
  // Route to build management view/
router.get("/detail/:inventoryId",utilities.handleErrors(invController.buildByModelId),);
  
  //Route to broken page
  router.get("/broken", handleErrors(invController.BuildBrokenPage));

module.exports = router;