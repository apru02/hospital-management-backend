const express = require("express");
const router = express.Router();
const fetchuser = require("../middlewares/fetchuser");

const User = require("../models/user");
const Medicine = require("../models/medicine");
const Vaccine = require("../models/vaccines");
// Middleware to verify the auth token

// Create New Medicine Stock

router.post("/create-medicine-stock", fetchuser, async (req, res) => {
  let success = false;
  try {
    const { name, quantity, price, expiry_date, description, manufacturer } =
      req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    // if user admin is true then only he can create log
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const medicine = new Medicine({
        name,
        quantity,
        price,
        expiry_date,
        description,
        manufacturer,
        created_by: userId,
      });
      await medicine.save();
      success = true;
      res.status(200).json({ success, message: "Medicine Stock Created" });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

// Fetch All Medicine Stock
router.get("/fetch-medicine-stock", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const medicine_stock = await Medicine.find();
      res.status(200).json({ success: true, data: medicine_stock });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

// Fetch Single Medicine Stock
router.get("/fetch-medicine-stock/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const medicine_stock = await Medicine.findById(req.params.id);
      res.status(200).json({ success: true, data: medicine_stock });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

//Update medicine stock
router.put("/update-medicine-stock/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const { quantity, price } = req.body;
      const medicine_stock = await Medicine.findById(req.params.id);
      medicine_stock.quantity = quantity;
      medicine_stock.price = price;
      medicine_stock.date_updated = Date.now();
      await medicine_stock.save();
      success = true;
      res.status(200).json({ success, message: "Medicine Stock Updated" });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

// Create New Vaccine Stock
router.post("/create-vaccine-stock", fetchuser, async (req, res) => {
  let success = false;
  try {
    const { name, quantity, price, expiry_date, description, manufacturer } =
      req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    // if user admin is true then only he can create log
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const vaccine = new Vaccine({
        name,
        quantity,
        price,
        expiry_date,
        description,
        manufacturer,
        created_by: userId,
      });
      await vaccine.save();
      success = true;
      res.status(200).json({ success, message: "Vaccine Stock Created" });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

// Fetch All Vaccine Stock
router.get("/fetch-vaccine-stock", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const vaccine_stock = await Vaccine.find();
      res.status(200).json({ success: true, data: vaccine_stock });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

// Fetch Single Vaccine Stock
router.get("/fetch-vaccine-stock/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const vaccine_stock = await Vaccine.findById(req.params.id);
      res.status(200).json({ success: true, data: vaccine_stock });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

//Update vaccine stock
router.put("/update-vaccine-stock/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (
      user.is_admin === true ||
      user.is_laboratorist === true ||
      user.is_pharmacist === true ||
      user.is_accountant === true
    ) {
      const { quantity, price } = req.body;
      const vaccine_stock = await Vaccine.findById(req.params.id);
      vaccine_stock.quantity = quantity;
      vaccine_stock.price = price;
      vaccine_stock.date_updated = Date.now();
      await vaccine_stock.save();
      success = true;
      res.status(200).json({ success, message: "Vaccine Stock Updated" });
    } else {
      res.status(401).json({ success, message: "Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
});

module.exports = router;
