const mysql = require('mysql');
const chalk = require('chalk');
const config = require('../config.json');

const database = mysql.createConnection({
    host: config.database.host,
    user: config.database.uName,
    password: config.database.pWord,
    database: config.database.dbName
  });

  database.connect((err) => {
    if (err) {
      console.error(chalk.yellowBright("[DB]") + chalk.redBright("[ERROR]") + err);
      process.exit(1)
    }
    console.log(chalk.yellowBright("[DB]") + chalk.greenBright("[INFO]") + " DB Connected!");
  });

module.exports = database;