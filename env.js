const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  TOKEN: process.env.TOKEN,
  DATABASE: process.env.DATABASE + process.env.DATABASE_PORT,
  DEV: process.env.DEV === "1" ? true : false,
};
