const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  initiateChapaPaymentForFreeUser,
  handleChapaCallback,
  verifyPaymentStatus,
} = require("../controllers/membershipPaymentsController");

const router = express.Router();

router.post(
  "/chapa/initiate-free-user",
  authenticate,
  initiateChapaPaymentForFreeUser
);

router.get("/chapa/callback", handleChapaCallback); // Chapa uses GET!

router.get("/verify/:tx_ref", authenticate, verifyPaymentStatus);

module.exports = router;
