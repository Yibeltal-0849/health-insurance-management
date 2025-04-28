const express = require("express");
const router = express.Router();
const { handlePayMembership } = require("../controllers/membershipController");

// Pay for Membership
router.post("/pay-membership", handlePayMembership);

module.exports = router;
