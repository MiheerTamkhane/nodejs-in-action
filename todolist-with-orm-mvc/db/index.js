require("dotenv/config")
const {drizzle} = require('drizzle-orm/node-postgres');

// postgress connection url
// postgres://<username>:<password>@<host>:<port>/<database>
const db = drizzle(process.env.DATABASE_URL);



module.exports = db;    