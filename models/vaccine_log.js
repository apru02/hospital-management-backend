const mongoose = require("mongoose");
const { Schema } = mongoose;
const vaccineLogSchema = new mongoose.Schema({
    vaccine_id: {
        type: Schema.Types.ObjectId,
        ref: "Vaccine",
    },
    dose_number: {
        type: Number,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    doctor_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    nurse_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    date_of_vaccination: {
        type: Date,
        default: Date.now,
    },
    remarks: {
        type: String,
    },
    next_vaccination_date: {
        type: String,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const VaccineLog = mongoose.model("VaccineLog", vaccineLogSchema);

module.exports = VaccineLog;
