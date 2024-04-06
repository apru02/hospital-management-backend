const mongoose = require("mongoose");
const { Schema } = mongoose;
const vaccineSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    manufacturer: { type: String, required: true },
    expiry_date: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    date_created: { type: Date, default: Date.now },
    date_updated: { type: Date, default: Date.now },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  
});

const Vaccine = mongoose.model("Vaccine", vaccineSchema);

module.exports = Vaccine;
