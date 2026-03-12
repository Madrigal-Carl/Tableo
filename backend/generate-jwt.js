// generate-jwt.js
const fs = require("fs");
const c = require("crypto");

// Read the existing .env
let env = fs.readFileSync(".env", "utf8");

// Replace JWT_SECRET
env = env.replace(
  /^JWT_SECRET=.*$/m,
  "JWT_SECRET=" + c.randomBytes(64).toString("hex"),
);

// Replace REFRESH_TOKEN_SECRET
env = env.replace(
  /^REFRESH_TOKEN_SECRET=.*$/m,
  "REFRESH_TOKEN_SECRET=" + c.randomBytes(64).toString("hex"),
);

// Write back to .env
fs.writeFileSync(".env", env);

console.log("Success!");
