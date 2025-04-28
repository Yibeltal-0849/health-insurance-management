const pool = require("../config/db");

// Handle Pay Membership
async function handlePayMembership(req, res) {
  const { customerId, amount, paymentMethod } = req.body;

  try {
    // Insert payment
    await pool.execute(
      `INSERT INTO payments (claim_id, approved_amount, payment_date, payment_method, status, processed_by)
       VALUES (?, ?, NOW(), ?, 'completed', NULL)`,
      [null, amount, paymentMethod]
    );

    // Update customer membership
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    await pool.execute(
      `UPDATE customers
       SET is_member = true,
           membership_expiry_date = ?
       WHERE id = ?`,
      [expiryDate, customerId]
    );

    res.json({ message: "Membership payment successful! 🎉" });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

module.exports = {
  handlePayMembership,
};
