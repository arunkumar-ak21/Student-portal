const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Show register page
router.get("/register", (req, res) => {
  res.render("register", { error: null, success: null });
});

// Show login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Default route
router.get("/", (req, res) => {
  res.redirect("/login");
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      srn,
      collegeEmail,
      personalEmail,
      phone,
      department,
      semester,
      password,
      confirmPassword
    } = req.body;

    if (password !== confirmPassword) {
      return res.render("register", {
        error: "Passwords do not match",
        success: null
      });
    }

    const existingUser = await User.findOne({
      $or: [{ collegeEmail }, { srn }]
    });

    if (existingUser) {
      return res.render("register", {
        error: "Student already exists with this SRN or college email",
        success: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      middleName,
      lastName,
      srn,
      collegeEmail,
      personalEmail,
      phone,
      department,
      semester,
      password: hashedPassword
    });

    res.render("register", {
      error: null,
      success: "Registration successful. Please login."
    });
  } catch (error) {
    res.render("register", {
      error: "Something went wrong. Please try again.",
      success: null
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { collegeEmail, password } = req.body;

    const user = await User.findOne({ collegeEmail }).populate("registeredCourses");

    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password" });
    }

    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      collegeEmail: user.collegeEmail
    };

    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: "Something went wrong. Please try again." });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;