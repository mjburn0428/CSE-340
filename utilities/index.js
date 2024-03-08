const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the classification select
 ************************** */
Util.getClassifications = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let selectList =
    '<select name="classification_id" id="select_classification" class="select-classification">';
  data.rows.forEach((row) => {
    selectList +=
      '<option id="' +
      row.classification_id +
      '" value=' +
      row.classification_id +
      ">" +
      row.classification_name +
      "</option>";
  });
  selectList += "</select>";
  return selectList;
};

/* **************************************
 * Build the classification view HTML
 * **************************************/
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<div class="inv-container" id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<div class="inv-card">';
      grid +='<a href="../../inv/detail/' + vehicle.inv_id +
        '" title="View ' + vehicle.inv_make + " " + vehicle.inv_model +
        'details"><img src="' + vehicle.inv_thumbnail + 
        '" alt="Image of ' + vehicle.inv_make + " " + vehicle.inv_model 
        + ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<hr>";
      grid += "<h2>";
      //** Adding a class to try and make css styling easier
      grid += '<a class="vehicle-image" href="../../inv/detail/' + vehicle.inv_id + '" title="View ' +
        vehicle.inv_make + " " + vehicle.inv_model + ' details">' +
        vehicle.inv_make + " " + vehicle.inv_model + "</a>";
      grid += "</h2>";
      grid += "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) + "</span>";
      grid += "</div>";
      grid += "</div>";
    })
    grid += "</div>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***********************************
* Build individual vehicle view HTML
*************************************/
Util.buildModelGrid = async function(data){ 
  const vehicle = data[0]
  let grid = '<section class="vehicle-cont">'
  grid += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors"/>'
  grid += '<div class="detail-cont">'
  grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + " Details" + '</h2>'
  grid += '<ul class="vehicle-details">'
  grid += '<li>' + '<span class="bold">' + "Price: " + '</span>' + "$" + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
  grid += '<li>' + '<span class="bold">' + "Description: " + '</span>' + vehicle.inv_description + '</li>'
  grid += '<li>' + '<span class="bold">' + "Color: " + '</span>' + vehicle.inv_color + '</li>'
  grid += '<li>' + '<span class="bold">' + "Mileage: " + '</span>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>'
  grid += '</ul>'
  grid += '</div>'
  grid += '</section>'
  return grid
};

Util.buildBrokenPage = function() {
  let broken = "";
  return broken;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util



