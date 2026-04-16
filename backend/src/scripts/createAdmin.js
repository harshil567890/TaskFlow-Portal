const connectDb = require("../config/db");
const config = require("../config/env");
const User = require("../models/user.model");
const ROLES = require("../constants/roles");

const run = async () => {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    // eslint-disable-next-line no-console
    console.error("Usage: node src/scripts/createAdmin.js \"Name\" email password");
    process.exit(1);
  }

  await connectDb(config.mongoUri);

  const existing = await User.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.error("User already exists with this email.");
    process.exit(1);
  }

  await User.create({
    name,
    email,
    password,
    role: ROLES.ADMIN,
  });

  // eslint-disable-next-line no-console
  console.log("Admin user created.");
  process.exit(0);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
});
