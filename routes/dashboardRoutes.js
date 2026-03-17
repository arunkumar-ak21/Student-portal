const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// Dashboard page
router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate("registeredCourses");

    res.render("dashboard", { user });
  } catch (error) {
    res.send("Error loading dashboard");
  }
});

// My Courses page
router.get("/my-courses", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate("registeredCourses");
    const courses = await Course.find();

    res.render("my-courses", { user, courses });
  } catch (error) {
    res.send("Error loading my courses page");
  }
});

// Profile page
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render("profile", { user });
  } catch (error) {
    res.send("Error loading profile page");
  }
});

// Register course
router.post("/register-course/:courseId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.redirect("/my-courses");
    }

    const alreadyRegistered = user.registeredCourses.some(
      (id) => id.toString() === course._id.toString()
    );

    if (!alreadyRegistered && course.seatsAvailable > 0) {
      user.registeredCourses.push(course._id);
      course.seatsAvailable -= 1;

      await user.save();
      await course.save();
    }

    res.redirect("/my-courses");
  } catch (error) {
    res.redirect("/my-courses");
  }
});

module.exports = router;