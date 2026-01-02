const { defineConfig } = require("drizzle-kit");
console.log('Database URL:', process.env.DATABASE_URL);
const config = defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

module.exports = config;
