require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected for seeding");

    await Course.deleteMany({});

    await Course.insertMany([
      {
        courseCode: "CS101",
        courseName: "Introduction to Computer Science",
        instructor: "Dr. Smith",
        credits: 4,
        schedule: "Mon/Wed 10:00 AM - 11:30 AM",
        seatsAvailable: 40
      },
      {
        courseCode: "CS201",
        courseName: "Data Structures",
        instructor: "Prof. Allen",
        credits: 3,
        schedule: "Tue/Thu 11:00 AM - 12:30 PM",
        seatsAvailable: 35
      },
      {
        courseCode: "CS301",
        courseName: "Database Management Systems",
        instructor: "Dr. Walker",
        credits: 4,
        schedule: "Mon/Fri 2:00 PM - 3:30 PM",
        seatsAvailable: 30
      },
      {
        courseCode: "CS401",
        courseName: "Web Technologies",
        instructor: "Prof. Brown",
        credits: 3,
        schedule: "Wed/Fri 9:00 AM - 10:30 AM",
        seatsAvailable: 25
      }
    ]);

    console.log("Courses added successfully");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });