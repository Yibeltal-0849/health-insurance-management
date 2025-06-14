const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  initiateChapaPayment,
  handleChapaCallback,
  verifyPaymentStatus,
} = require("../controllers/membershipPaymentsController");

const router = express.Router();

router.post("/chapa/initiate", authenticate, initiateChapaPayment);

router.get("/chapa/callback", handleChapaCallback); // Chapa uses GET!

router.get("/verify/:tx_ref", authenticate, verifyPaymentStatus);

module.exports = router;
