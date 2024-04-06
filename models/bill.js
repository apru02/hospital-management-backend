const mongoose = require("mongoose");
const { Schema } = mongoose;

const billSchema = new mongoose.Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pharmacist_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  accountant_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date_of_billing: {
    type: Date,
    default: Date.now,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  medicines: [
    {
      medicine_id: {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  payment_status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Paid",
  },
  remarks: {
    type: String,
  },
  date_of_payment: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
