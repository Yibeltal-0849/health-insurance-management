const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");
const registerCustomer = require("../controllers/customerController");
const registerFamilyMember = require("../controllers/familyController");
const { authenticate } = require("../middlewares/authMiddleware");

//register customer
router.post("/sub_city_customer/register", authenticate, register);

//register customer information
router.post("/customer_information/register", authenticate, registerCustomer);

//register family members
router.post(
  "/customer-family-members/register",
  authenticate,
  registerFamilyMember
);

module.exports = router;
