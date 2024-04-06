const mongoose = require("mongoose");
const { Schema } = mongoose;
const hospitalLogSchema = new mongoose.Schema({
  visitor_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  check_in: {
    type: Date,
  },
  check_out: {
    type: Date,
  },
  purpose: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const Hospital = mongoose.model("Hospital", hospitalLogSchema);

module.exports = Hospital;
