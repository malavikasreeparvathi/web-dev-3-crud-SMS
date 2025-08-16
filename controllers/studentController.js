const Student = require("../models/Student");

// Show all students
exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.render("index", { students });
};

// Add new student
exports.createStudent = async (req, res) => {
  const { name, age, course } = req.body;
  await Student.create({ name, age, course });
  res.redirect("/");
};

// Edit form
exports.editStudentForm = async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("edit", { student });
};

// Update student
exports.updateStudent = async (req, res) => {
  const { name, age, course } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, course });
  res.redirect("/");
};

// Delete student
exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/");
};