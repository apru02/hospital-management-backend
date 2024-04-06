const express = require("express");
const User = require("../models/user");
const router = express.Router();
// const multer = require("multer");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middlewares/fetchuser");
const JWT_SECRET = "ShouldItellY#u?";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
//patient
router.post(
  "/createpatient",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        is_patient: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//doctor
router.post(
  "/createdoctor",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
    body("education", "Enter a valid education").isLength({ min: 3 }),
    body("experience", "Enter a valid experience").isLength({ min: 3 }),
    body("specialization", "Enter a valid specialization").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        education: req.body.education,
        experience: req.body.experience,
        specialization: req.body.specialization,
        is_doctor: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//admin
router.post(
  "/createadmin",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        is_admin: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//accountant
router.post(
  "/createaccountant",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        is_accountant: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//nurse
router.post(
  "/createnurse",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        is_nurse: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//laboratorist
router.post(
  "/createlaboratorist",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        is_laboratorist: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//pharmacist
router.post(
  "/createpharmacist",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 3,
    }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 3 }),
    body("pin_code", "Enter a valid pin code").isLength({ min: 6 }),
    body("city", "Enter a valid city").isLength({ min: 3 }),
    body("state", "Enter a valid state").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        phone: req.body.phone,
        address: req.body.address,
        pin_code: req.body.pin_code,
        city: req.body.city,
        state: req.body.state,
        is_pharmacist: true,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json(user)
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// //Route 5 for updating user details
// router.put("/updateuser/:id", fetchuser, async (req, res) => {
//   try {
//     if (req.user.id !== req.params.id) {
//       return res.status(401).send("Not Allowed");
//     }

//     const { name, email } = req.body;
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     user.name = name;
//     user.email = email;
//     await user.save();
//     let success = true;
//     res.json({ success, message: "Profile updated successfully", user });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// //Route 6 for prompting Names of user for search using username
// // Assuming you have imported the necessary dependencies and defined the User model

// router.get("/searchuser/:username", fetchuser, async (req, res) => {
//   const { username } = req.params;

//   try {
//     // Search for users with matching username
//     const users = await User.findOne({ username });
//     if (!users || users._id.toString() === req.user.id.toString()) {
//       return res
//         .status(404)
//         .json({ success: false, error: "No users found" });
//     }
//     // Return the found users in the response
//     res.json({ success: true, users });
//   } catch (error) {
//     // Handle any errors that occur during the search
//     console.error(error);
//     res
//       .status(500)
//       .json({ success:false,error: "An error occurred while searching for users." });
//   }
// });
//Route for fetching user profile filename based on id

module.exports = router;
