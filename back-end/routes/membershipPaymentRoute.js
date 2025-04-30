const db = require("../config/db");
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

// Test endpoint (remove in production)
// router.get("/test-callback", async (req, res) => {
//   try {
//     const testTxRef = "tx-test-" + Date.now();
//     await db.execute(
//       `INSERT INTO membership_payments
//        (customer_id, amount, payment_method, transaction_reference, status)
//        VALUES (?, ?, ?, ?, ?)`,
//       [1, 100.0, "mobile", testTxRef, "pending"]
//     );
//     res.json({
//       message: "Test record created",
//       tx_ref: testTxRef,
//       verify_url: `/api/payment/verify/${testTxRef}`,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
