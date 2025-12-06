const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

// FIXED PASSWORD HASHING MIDDLEWARE
userSchema.pre("save", async function () {
  // Only hash password if it was modified or is new
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// PASSWORD CHECK METHOD
userSchema.methods.comparePassword = function (pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("User", userSchema);
