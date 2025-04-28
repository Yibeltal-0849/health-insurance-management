const express = require("express");
const router = express.Router();
const registerCustomer = require("../controllers/customerController");
const upload = require("../helpers/upload");
const {
  authenticate,
  canRegisterCustomer,
} = require("../middlewares/authMiddleware");

//register customer with full information
router.post(
  "/register",
  authenticate,
  canRegisterCustomer,
  upload.single("photo"),
  registerCustomer
);

module.exports = router;
