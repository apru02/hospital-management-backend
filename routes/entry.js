const express = require("express");
const router = express.Router();
const fetchuser = require("../middlewares/fetchuser");

const User = require("../models/user");
const Hospital = require("../models/hospital_log");
// const Patient = require("../models/patient_log");
// const VaccineLog = require("../models/vaccine_log");
// Middleware to verify the auth token

// Create hospital log route for check in
router.post("/check-in/:id", fetchuser, async (req, res) => {
  try {
    const { purpose } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    const visitor_id = req.params.id;
    let success = false;
    // if user admin is true then only he can create log
    if (
      user.is_admin === true ||
      user.is_doctor === true ||
      user.is_nurse === true ||
      user.is_accountant === true ||
      user.is_pharmacist === true ||
      user.is_laboratorist === true
    ) {
      const hospital = new Hospital({
        visitor_id,
        purpose,
        check_in: new Date(),
      });
      await hospital.save();
      success = true;
      res.status(200).json({ success, data: hospital });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

router.get("/fetch-all-log", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = false;
    if (user.is_admin === true) {
      // for every log find the user details and send it along with each log
      const hospitals = await Hospital.find();
      const newHospitals = [];
      for (const hospital of hospitals) {
        const user_details = await User.findById(hospital.visitor_id).select(
          "name email phone address city state pin_code"
        );
        const newHospital = {
          _id: hospital._id,
          visitor_id: hospital.visitor_id,
          check_in: hospital.check_in,
          check_out: hospital.check_out,
          purpose: hospital.purpose,
          name: user_details.name,
          email: user_details.email,
          phone: user_details.phone,
          address: user_details.address,
          city: user_details.city,
          state: user_details.state,
          pin_code: user_details.pin_code,
        };
        newHospitals.push(newHospital);
      }
      success = true;
      res.status(200).json({ success, data: newHospitals });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal server error" });
  }
});

//fetch all logs of a user
router.get("/fetch-all-log/:id", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = false;
    const visitor_id = req.params.id;
    if (user.is_admin === true || userId === visitor_id) {
      const hospitals = await Hospital.find({ visitor_id });
      const newHospitals = [];
      for (const hospital of hospitals) {
        const user_details = await User.findById(hospital.visitor_id).select(
          "name email phone address city state pin_code"
        );
        const newHospital = {
          _id: hospital._id,
          visitor_id: hospital.visitor_id,
          check_in: hospital.check_in,
          check_out: hospital.check_out,
          purpose: hospital.purpose,
          name: user_details.name,
          email: user_details.email,
          phone: user_details.phone,
          address: user_details.address,
          city: user_details.city,
          state: user_details.state,
          pin_code: user_details.pin_code,
        };
        newHospitals.push(newHospital);
      }
      success = true;
      res.status(200).json({ success, data: newHospitals });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal server error" });
  }
});

//update hospital log for check out
router.put("/check-out/:id", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    const check_out = new Date();
    let success = false;
    if (
      user.is_admin === true ||
      user.is_doctor === true ||
      user.is_nurse === true ||
      user.is_accountant === true ||
      user.is_pharmacist === true ||
      user.is_laboratorist === true
    ) {
      const hospital = await Hospital.findById(req.params.id);
      if (user.is_admin === false && hospital.visitor_id !== userId) {
        return res.status(401).json({ success, message: "Not Allowed" });
      }
      hospital.check_out = check_out;
      await hospital.save();
      success = true;
      res.status(200).json({ success, data: hospital });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal server error" });
  }
});

//check available doctors
router.get("/check-doctors", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = false;
    //find logs of today
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const hospitals = await Hospital.find({
      check_in: { $gte: start, $lt: end },
    });
    const doctors = [];
    for (const hospital of hospitals) {
      const user = await User.findById(hospital.visitor_id);
      // console.log(user.name);
      if (user.is_doctor === true && !hospital.check_out) {
        const new_doctor = {
          _id: user._id,
          name: user.name,
          email: user.email,
          education: user.education ? user.education : "Not Available",
          experience: user.experience ? user.experience : "Not Available",
          specialization: user.specialization ? user.specialization : "Not Available",
          phone: user.phone,
        };
        doctors.push(new_doctor);
      }
    }
    success = true;
    res.status(200).json({ success, data: doctors });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

module.exports = router;
