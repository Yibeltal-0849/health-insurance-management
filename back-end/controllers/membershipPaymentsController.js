const axios = require("axios");
const db = require("../config/db");

const initiateChapaPayment = async (req, res) => {
  const {
    amount,
    email,
    first_name,
    last_name,
    phone_number,
    currency = "ETB",
  } = req.body;

  const user_id = req.user.id; // Authenticated user ID
  const connection = await db.getConnection();

  try {
    const [customerRows] = await connection.execute(
      "SELECT id FROM customers WHERE user_id = ?",
      [user_id]
    );

    if (!customerRows.length) {
      return res.status(404).json({ error: "Customer profile not found." });
    }

    const customer_id = customerRows[0].id;
    const tx_ref = `tx-${Date.now()}-${customer_id}`;

    const callback_url = `${process.env.NGROK_URL}/api/payment/chapa/callback`;

    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO membership_payments 
       (customer_id, amount, payment_method, transaction_reference, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [customer_id, amount, "chapa", tx_ref, "pending"]
    );

    const chapaResponse = await axios.post(
      `${process.env.CHAPA_BASE_URL}/transaction/initialize`,
      {
        amount,
        currency,
        email,
        first_name,
        last_name,
        phone_number: phone_number || "0912345678",
        tx_ref,
        callback_url,
        return_url: "http://localhost:6000/payment-success",
        customization: {
          title: "  Payment",
          description: "Payment for Health Insurance",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    await connection.commit();

    res.status(200).json({
      message: "Payment initiated successfully",
      paymentUrl: chapaResponse.data.data.checkout_url,
      tx_ref,
    });
  } catch (error) {
    await connection.rollback();
    console.error(
      "Initiate Payment Error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to initiate payment" });
  } finally {
    connection.release();
  }
};
const handleChapaCallback = async (req, res) => {
  console.log("callback received", req.body || req.query);
  const tx_ref = req.body?.trx_ref || req.query?.trx_ref;
  console.log("🔔 Received tx_ref:", tx_ref);

  if (!tx_ref) {
    return res.status(400).json({ error: "Missing transaction reference" });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const verifyUrl = `${process.env.CHAPA_BASE_URL}/transaction/verify/${tx_ref}`;
    console.log("🔍 Verifying with:", verifyUrl);

    const verifyResponse = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    });

    const chapaStatus = verifyResponse.data?.data?.status;
    // console.log(chapaStatus);
    // console.log(verifyResponse.data);
    const normalizedStatus =
      chapaStatus === "success" ? "completed" : chapaStatus;

    const [updateResult] = await connection.execute(
      `UPDATE membership_payments 
       SET status = ?, payment_date = NOW(), chapa_response = ? 
       WHERE transaction_reference = ?`,
      [normalizedStatus, JSON.stringify(verifyResponse.data), tx_ref]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (normalizedStatus === "completed") {
      await connection.execute(
        `UPDATE customers 
         SET insurance_status = 'active' 
         WHERE id = (
           SELECT customer_id FROM membership_payments WHERE transaction_reference = ?
         )`,
        [tx_ref]
      );
    }

    await connection.commit();
    return res.status(200).json({ status: normalizedStatus }); // ✅ RETURN here
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("❌ Callback error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Processing failed" }); // ✅ RETURN here
  } finally {
    if (connection) connection.release();
  }
};

const verifyPaymentStatus = async (req, res) => {
  const { tx_ref } = req.params;
  let connection;

  try {
    connection = await db.getConnection();

    // Get payment from DB
    const [payment] = await connection.execute(
      `SELECT * FROM membership_payments 
       WHERE transaction_reference = ?`,
      [tx_ref]
    );

    if (payment.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (payment[0].status === "completed") {
      return res.json({
        status: "completed",
        data: payment[0],
      });
    }

    // Check Chapa status
    const verifyResponse = await axios.get(
      `${process.env.CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaStatus = verifyResponse.data?.data?.status;
    const normalizedStatus =
      chapaStatus === "success" ? "completed" : chapaStatus;

    // Update DB if different
    if (normalizedStatus !== payment[0].status) {
      await connection.execute(
        `UPDATE membership_payments 
         SET status = ?, payment_date = NOW(), chapa_response = ? 
         WHERE transaction_reference = ?`,
        [normalizedStatus, JSON.stringify(verifyResponse.data), tx_ref]
      );
    }

    res.json({
      status: normalizedStatus,
      verified: true,
      data: verifyResponse.data?.data,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      error: "Verification failed",
      details: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  initiateChapaPayment,
  handleChapaCallback,
  verifyPaymentStatus,
};
