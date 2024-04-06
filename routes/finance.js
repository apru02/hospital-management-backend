const express = require("express");
const router = express.Router();
const fetchuser = require("../middlewares/fetchuser");

const User = require("../models/user");
const Medicine = require("../models/medicine");
const Vaccine = require("../models/vaccines");
const Bill = require("../models/bill");
const VaccineLog = require("../models/vaccine_log");
// Middleware to verify the auth token

//Create New Bill
router.post("/create-bill", fetchuser, async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      accountant_id,
      pharmacist_id,
      total_amount,
      medicines,
      payment_status,
      remarks,
    } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = false;
    // if user admin is true then only he can create log
    if (
      user.is_admin === true ||
      user.is_accountant === true ||
      user.is_pharmacist === true
    ) {
      //check if medicines in stock
      let allMedicinesAvailable = true;
      for (const medicine of medicines) {
        const med = await Medicine.findById(medicine.medicine_id);
        if (med.quantity < medicine.quantity) {
          allMedicinesAvailable = false;
          break;
        }
      }
      if (allMedicinesAvailable) {
        const bill = new Bill({
          patient_id,
          doctor_id,
          accountant_id,
          pharmacist_id,
          total_amount,
          medicines,
          payment_status,
          remarks,
          created_by: userId,
        });
        await bill.save();
        //update medicine stock
        for (const medicine of medicines) {
          const med = await Medicine.findById(medicine.medicine_id);
          med.quantity -= medicine.quantity;
          await med.save();
        }
        success = true;
        res.status(200).json({ success, message: "Bill Created" });
      } else {
        res.status(400).json({ success, message: "Medicines Not Available" });
      }
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

//Fetch All Bills
router.get("/fetch-bills", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = false;
    if (user.is_admin === true || user.is_accountant === true) {
      const bills = await Bill.find();
      const data = [];
      for (const bill of bills) {
        const patient = await User.findById(bill.patient_id).select(
          "-password"
        );
        const doctor = await User.findById(bill.doctor_id).select("-password");
        const pharmacist = await User.findById(bill.pharmacist_id).select(
          "-password"
        );
        const accountant = await User.findById(bill.accountant_id).select(
          "-password"
        );
        const new_medicines = [];
        for (const medicine of bill.medicines) {
          const med = await Medicine.findById(medicine.medicine_id);
          new_medicines.push({
            medicine_id: med._id,
            medicine_name: med.name,
            quantity: medicine.quantity,
            unit_price: med.price,
            total_price: medicine.quantity * med.price,
          });
        }
        const new_bill = {
          _id: bill._id,
          patient_id: bill.patient_id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          patient_email: patient.email,
          doctor_id: bill.doctor_id,
          doctor_name: doctor.name,
          pharmacist_id: bill.pharmacist_id,
          pharmacist_name: pharmacist.name,
          accountant_id: bill.accountant_id,
          accountant_name: accountant.name,
          date_of_billing: bill.date_of_billing,
          total_amount: bill.total_amount,
          medicines: new_medicines,
          payment_status: bill.payment_status,
          remarks: bill.remarks,
          date_of_payment: bill.date_of_payment,
        };
        data.push(new_bill);
      }
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

//fetch all bills of a patient
router.get("/fetch-bills-patient/:id", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = false;
    if (user.is_admin === true || user.is_accountant === true || user.is_patient === true) {
      const patient_id = req.params.id;
      const bills = await Bill.find({ patient_id });
      const data = [];
      for (const bill of bills) {
        const patient = await User.findById(bill.patient_id).select(
          "-password"
        );
        const doctor = await User.findById(bill.doctor_id).select("-password");
        const pharmacist = await User.findById(bill.pharmacist_id).select(
          "-password"
        );
        const accountant = await User.findById(bill.accountant_id).select(
          "-password"
        );
        const new_medicines = [];
        for (const medicine of bill.medicines) {
          const med = await Medicine.findById(medicine.medicine_id);
          new_medicines.push({
            medicine_id: med._id,
            medicine_name: med.name,
            quantity: medicine.quantity,
            unit_price: med.price,
            total_price: medicine.quantity * med.price,
          });
        }
        const new_bill = {
          _id: bill._id,
          patient_id: bill.patient_id,
          patient_name: patient.name,
          patient_phone: patient.phone,
          patient_email: patient.email,
          doctor_id: bill.doctor_id,
          doctor_name: doctor.name,
          pharmacist_id: bill.pharmacist_id,
          pharmacist_name: pharmacist.name,
          accountant_id: bill.accountant_id,
          accountant_name: accountant.name,
          date_of_billing: bill.date_of_billing,
          total_amount: bill.total_amount,
          medicines: new_medicines,
          payment_status: bill.payment_status,
          remarks: bill.remarks,
          date_of_payment: bill.date_of_payment,
        };
        data.push(new_bill);
      }
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
