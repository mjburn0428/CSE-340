const invModel = require("../models/inventory-model");
const msgModel = require("../models/message-model")
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +='<a href="../../inv/detail/' +
        vehicle.inv_id +'" title="View ' 
        +vehicle.inv_make +" " +
        vehicle.inv_model +'details"><img src="' +
        vehicle.inv_thumbnail +'" alt="Image of ' +
        vehicle.inv_make +" " +
        vehicle.inv_model +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +='<a href="../../inv/detail/' +
        vehicle.inv_id +'" title="View ' +
        vehicle.inv_make +" " +
        vehicle.inv_model +' details">' +
        vehicle.inv_make +" " +
        vehicle.inv_model +"</a>";
      grid += "</h2>";
      grid +="<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +"</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailView = async function (vehicle) {
  const formatter = new Intl.NumberFormat("en-US");

  const html = `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${
    vehicle.inv_model
  }" />
      <div class="vehicle-detail-text">
        <p>Year: ${vehicle.inv_year}</p>
        <p>Price: $${formatter.format(vehicle.inv_price)}</p>
        <p>Mileage: ${formatter.format(vehicle.inv_miles)} miles</p>
        <p>Color: ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
  return html;
};

/* **************************************
 * Build the classification dropdown
 * ************************************ */
Util.buildDropdown = async function () {
  let classifications = await invModel.getClassifications();
  const dropdownOptions = classifications.rows
    .map((classification) => {
      return `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
    })
    .join("");

  const dropdown = `
    <select id="classification-id" name="classification_id">
      ${dropdownOptions}
    </select>
  `;

  return dropdown;
};

/* **************************************
 * Middleware for handling errors
 * ************************************ */
Util.handleError = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check JWT token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Middleware to check if user is logged in
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware to check if user is Employee or Admin from JWT Token
 **************************************** */
Util.checkAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")
  ) {
    next();
  } else {
    req.flash(
      "notice",
      "You must be logged in as an Employee or Admin to access this page"
    );
    return res.redirect("/account/login");
  }
};

/* ************************
 * Constructs the account HTML select options
 ************************** */
Util.getAccountSelect = async function (selectedOption) {
  let data = await accModel.fetchAllAccounts()
  let options = `<option value="">Select a Recipient</option>`
  data.rows.forEach((row => {
    options += 
      `<option value="${row.account_id}"
      ${row.account_id === Number(selectedOption) ? 'selected': ''}>
      ${row.account_firstname} ${row.account_lastname}
      </option>`
  }))
  return options
}

Util.getAccountMessages = async function (account_id) {
  let data = await msgModel.getNewMsgCount(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No new messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Recieved</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => { 
      dataTable += `<tr><td><div class="bubble` 
        if (row.message_read) {
          dataTable += ` true"`
        } else {
          dataTable += ` false"`
        }
      dataTable += `></div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`; 
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

/* ************************
 * Constructs archived messages on account_id
 ************************** */
Util.getArchivedMessages = async function (account_id) {
  let data = await msgModel.getArchivedMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No archived messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Recieved</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => {
      dataTable += `<tr><td><div class="bubble` 
        if (row.message_read) {
          dataTable += ` true"`
        } else {
          dataTable += ` false"`
        }
      dataTable += `></div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`;
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}


module.exports = Util;
