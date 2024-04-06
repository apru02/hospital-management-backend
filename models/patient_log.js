const mongoose = require("mongoose");
const { Schema } = mongoose;
const PatientLogSchema = new mongoose.Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date_of_visit: {
    type: Date,
    default: Date.now,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  prescription: {
    type: String,
    required: true,
  },
  follow_up_date: {
    type: String,
  },
  remarks: {
    type: String,
  },
});

const Patient = mongoose.model("Patient", PatientLogSchema);

module.exports = Patient;
