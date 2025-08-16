require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Models
const Student = require("./models/Student");

// Routes

// Home page
app.get("/", (req, res) => {
  res.render("home");
});

// Student list with optional search
app.get("/students", async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      query = { name: { $regex: req.query.search, $options: "i" } };
    }
    const students = await Student.find(query);
    res.render("index", { students, search: req.query.search || "" });
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).send("Error fetching students: " + err.message);
  }
});

// Add student form
app.get("/students/add", (req, res) => {
  res.render("add");
});

// Save new student
app.post("/students/add", async (req, res) => {
  try {
    const { slno, name, age, specialization, email, phone } = req.body;
    const student = new Student({ slno, name, age, specialization, email, phone });
    await student.save();
    res.redirect("/students");
  } catch (err) {
    console.error("Error adding student:", err.message);
    res.status(500).send("Error adding student: " + err.message);
  }
});

// Edit student form
app.get("/students/edit/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.send("Student not found");
    res.render("edit", { student });
  } catch (err) {
    console.error("Error fetching student:", err.message);
    res.status(500).send("Error fetching student: " + err.message);
  }
});

// Update student
app.post("/students/edit/:id", async (req, res) => {
  try {
    const { slno, name, age, specialization, email, phone } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { slno, name, age, specialization, email, phone });
    res.redirect("/students");
  } catch (err) {
    console.error("Error updating student:", err.message);
    res.status(500).send("Error updating student: " + err.message);
  }
});

// Delete student
app.get("/students/delete/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect("/students");
  } catch (err) {
    console.error("Error deleting student:", err.message);
    res.status(500).send("Error deleting student: " + err.message);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));