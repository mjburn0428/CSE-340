const pool = require("../database/");

/* *****************************
 *  Funtion to Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname,account_email,account_password) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************************
 *  Function to Check for existing email address
 * ************************************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Function to Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  console.log("\ngetting account by email from model\n");
  try {
    const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",[account_email]);
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* ****************************************
 * Function to Get Account date by ID
 * *************************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",[account_id]);
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found");
  }
}

/* ****************************************
 *  Function to Update Account Information
 * *************************************** */
async function updateAccount(account_id, firstname, lastname, email) {
  console.log("\nUPDATING ACCOUNT:\n", account_id, firstname, lastname, email);
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [firstname,lastname,email,account_id,]);
    return result.rowCount > 0;
  } catch (error) {
    return error.message;
  }
}

/* ****************************************
 *  Function to Change Password
 * *************************************** */
async function changePassword(account_id, hashedPassword) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    return error.message;
  }
}

module.exports = {checkExistingEmail,registerAccount,getAccountByEmail,getAccountById,updateAccount,changePassword,
};
