const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  slno: { type: Number, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  specialization: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model("Student", studentSchema);