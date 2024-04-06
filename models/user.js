const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
  is_patient: { type: Boolean, default: false },
  is_doctor: { type: Boolean, default: false },
  is_nurse: { type: Boolean, default: false },
  is_laboratorist: { type: Boolean, default: false },
  is_pharmacist: { type: Boolean, default: false },
  is_accountant: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  pin_code: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  education: { type: String },
  experience: { type: String },
  specialization: { type: String },
  date_created: { type: Date, default: Date.now },
  date_updated: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
