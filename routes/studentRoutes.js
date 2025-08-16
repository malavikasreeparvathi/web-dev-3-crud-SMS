const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// List all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.render("index", { students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).send("Error fetching students");
  }
});

module.exports = router;