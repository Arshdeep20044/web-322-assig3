const router = require("express").Router();
const User = require("../models/User");

function validateRegisterInput({ username, email, password }) {
  if (!username || !email || !password) return "All fields are required.";

  if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const validationError = validateRegisterInput({ username, email, password });
    if (validationError) {
      return res.render("register", { error: validationError });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.render("register", { error: "Email already exists" });
    }

  
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.render("register", { error: "Username already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return res.redirect("/login");
  } catch (err) {
   
    console.error("REGISTER ERROR:", err);

    
    if (err.code === 11000) {
      const dupField = Object.keys(err.keyValue || {}).join(", ");
      return res.render("register", { error: `Duplicate value for: ${dupField}` });
    }

    
    if (err.name === "ValidationError") {
      const msgs = Object.values(err.errors).map(e => e.message).join(" ");
      return res.render("register", { error: msgs || "Validation error" });
    }

    return res.render("register", { error: "Something went wrong during registration. Try again." });
  }
});


router.get("/login", (req, res) => {
  res.render("login", { error: null });
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.render("login", { error: "Please provide email and password." });

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.render("login", { error: "Invalid email or password" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.render("login", { error: "Something went wrong during login." });
  }
});


router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login");
});

module.exports = router;
