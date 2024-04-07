const express = require("express");
const router = express.Router();
const fetchuser = require("../middlewares/fetchuser");

const User = require("../models/user");
const Hospital = require("../models/hospital_log");
const Patient = require("../models/patient_log");
const VaccineLog = require("../models/vaccine_log");
const Vaccine = require("../models/vaccines");
// Middleware to verify the auth token

// Create patient log by doctor route
router.post("/create-patient-log/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const { diagnosis, prescription, follow_up_date, remarks } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    const patient_id = req.params.id;
    // if user admin is true then only he can create log
    if (user.is_admin === true || user.is_doctor === true) {
      const patient = new Patient({
        patient_id,
        doctor_id: userId,
        diagnosis,
        prescription,
        follow_up_date,
        remarks,
      });
      await patient.save();
      success = true;
      res.status(200).json({ success, message: "Patient Log Created" });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

router.get("/fetch-log-doctor", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (user.is_admin === true || user.is_doctor === true) {
      const patient_log = await Patient.find({ doctor_id: userId });
      const doctor = await User.findById(userId).select("-password");
      const data = [];
      for (const log of patient_log) {
        const patient = await User.findById(log.patient_id).select("-password");
        const new_log = {
          _id: log._id,
          patient_id: log.patient_id,
          patient_name: patient.name,
          patient_city: patient.city,
          patient_state: patient.state,
          patient_phone: patient.phone,
          patient_email: patient.email,
          doctor_id: log.doctor_id,
          doctor_name: doctor.name,
          date_of_visit: log.date_of_visit,
          diagnosis: log.diagnosis,
          prescription: log.prescription,
          follow_up_date: log.follow_up_date,
          remarks: log.remarks,
        };
        data.push(new_log);
      }
      data.sort((a, b) => b.date_of_visit - a.date_of_visit);
      success = true;
      res.status(200).json({ success, data });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal server error" });
  }
});

//fetch medical history of patient
router.get("/fetch-patient-log/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_doctor === true ||
      user.is_patient === true
    ) {
      const patient_id = req.params.id;
      const patient_log = await Patient.find({ patient_id: patient_id });

      const data = [];
      for (const log of patient_log) {
        const patient = await User.findById(log.patient_id).select("-password");
        const doctor = await User.findById(log.doctor_id).select("-password");

        const new_log = {
          _id: log._id,
          patient_id: log.patient_id,
          patient_name: patient.name,
          patient_email: patient.email,
          patient_city: patient.city,
          patient_state: patient.state,
          patient_phone: patient.phone,
          doctor_id: log.doctor_id,
          doctor_name: doctor.name,
          doctor_email: doctor.email,
          doctor_phone: doctor.phone,
          date_of_visit: log.date_of_visit,
          diagnosis: log.diagnosis,
          prescription: log.prescription,
          follow_up_date: log.follow_up_date,
          remarks: log.remarks,
        };
        data.push(new_log);
      }
      data.sort((a, b) => b.date_of_visit - a.date_of_visit);
      success = true;
      res.status(200).json({ success, data });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal server error" });
  }
});

//Create Vaccine Log
router.post("/create-vaccine-log", fetchuser, async (req, res) => {
  let success = false;
  try {
    const {
      vaccine_id,
      patient_id,
      doctor_id,
      nurse_id,
      dose_number,
      remarks,
      next_vaccination_date,
    } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_nurse === true ||
      user.is_doctor === true
    ) {
      // check if vaccine stock is available
      const vaccine_stock = await Vaccine.findById(vaccine_id);
      if (vaccine_stock.quantity < dose_number) {
        return res
          .status(400)
          .json({ success, message: "Vaccine Stock Not Available" });
      }
      // update vaccine stock
      vaccine_stock.quantity -= dose_number;
      await vaccine_stock.save();
      const vaccine = new VaccineLog({
        vaccine_id,
        patient_id,
        doctor_id,
        nurse_id,
        dose_number,
        total_price: dose_number * vaccine_stock.price,
        remarks,
        next_vaccination_date,
        created_by: userId,
      });
      await vaccine.save();
      success = true;
      res.status(200).json({ success, message: "Vaccine Log Created" });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

//Fetch all Vaccine Log
router.get("/fetch-vaccine-log", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_doctor === true ||
      user.is_nurse === true
    ) {
      const vaccine_log = await VaccineLog.find();
      const data = [];
      for (const log of vaccine_log) {
        const patient = await User.findById(log.patient_id).select("-password");
        const doctor = await User.findById(log.doctor_id).select("-password");
        const nurse = await User.findById(log.nurse_id).select("-password");
        const vaccine = await Vaccine.findById(log.vaccine_id);
        const new_log = {
          _id: log._id,
          vaccine_id: log.vaccine_id,
          vaccine_name: vaccine.name,
          vaccine_manufacturer: vaccine.manufacturer,
          vaccine_description: vaccine.description,
          patient_id: log.patient_id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          patient_email: patient.email,
          doctor_id: log.doctor_id,
          doctor_name: doctor.name,
          nurse_id: log.nurse_id,
          nurse_name: nurse.name,
          nurse_phone: nurse.phone,
          dose_number: log.dose_number,
          unit_price: vaccine.price,
          total_price: log.total_price,
          date_of_vaccination: log.date_of_vaccination,
          remarks: log.remarks,
          next_vaccination_date: log.next_vaccination_date,
        };
        data.push(new_log);
      }
      data.sort((a, b) => b.date_of_vaccination - a.date_of_vaccination);
      success = true;
      res.status(200).json({ success, data });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

//Fetch all Vaccine Log by Patient
router.get("/fetch-vaccine-log-patient/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_patient === true ||
      user.is_doctor === true
    ) {
      const patient_id = req.params.id;
      if (user.is_patient === true && userId !== patient_id) {
        return res.status(401).json({ success, message: "Not Allowed" });
      }
      const vaccine_log = await VaccineLog.find({ patient_id });
      const data = [];
      for (const log of vaccine_log) {
        const patient = await User.findById(log.patient_id).select("-password");
        const doctor = await User.findById(log.doctor_id).select("-password");
        const nurse = await User.findById(log.nurse_id).select("-password");
        const vaccine = await Vaccine.findById(log.vaccine_id);
        const new_log = {
          _id: log._id,
          vaccine_id: log.vaccine_id,
          vaccine_name: vaccine.name,
          vaccine_manufacturer: vaccine.manufacturer,
          vaccine_description: vaccine.description,
          patient_id: log.patient_id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          patient_email: patient.email,
          doctor_id: log.doctor_id,
          doctor_name: doctor.name,
          nurse_id: log.nurse_id,
          nurse_name: nurse.name,
          nurse_phone: nurse.phone,
          dose_number: log.dose_number,
          unit_price: vaccine.price,
          total_price: log.total_price,
          date_of_vaccination: log.date_of_vaccination,
          remarks: log.remarks,
          next_vaccination_date: log.next_vaccination_date,
        };
        data.push(new_log);
      }
      //sort by date of vaccination
      data.sort((a, b) => b.date_of_vaccination - a.date_of_vaccination);
      success = true;
      res.status(200).json({ success, data });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

module.exports = router;
