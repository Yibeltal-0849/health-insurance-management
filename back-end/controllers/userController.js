const db = require("../config/db");

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, first_name, last_name, email, role, status } = req.body;

  try {
    const [result] = await db.query(
      `
      UPDATE users
      SET username = ?, first_name = ?, last_name = ?, email = ?, role = ?, status = ?
      WHERE id = ?
      `,
      [username, first_name, last_name, email, role, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    return res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection(); // get a single connection from the pool

  try {
    // Start transaction
    await connection.beginTransaction();

    // 1. Delete logs created by user, Delete FROM mean delete row
    await db.query("DELETE FROM logs WHERE user_id = ?", [id]);

    // 2. Delete insurance policies created by user
    await db.query("DELETE FROM insurance_policies WHERE created_by = ?", [id]);

    // 3. Update claims approved_by = NULL if approved by this user
    await db.query(
      "UPDATE claims SET approved_by = NULL WHERE approved_by = ?",
      [id]
    );

    // 4. Update claims hospital_id = NULL if created by this user (doctor)and if this doctor is removed
    await db.query(
      "UPDATE claims SET hospital_id = NULL WHERE hospital_id = ?",
      [id]
    );

    // 5. Update payments processed_by = NULL
    await db.query(
      "UPDATE payments SET processed_by = NULL WHERE processed_by = ?",
      [id]
    );

    // 7. If this user is a customer, delete customer, family_members, membership_payments
    const [customer] = await db.query(
      "SELECT id FROM customers WHERE user_id = ?",
      [id]
    );

    if (customer.length > 0) {
      const customerId = customer[0].id;

      // Delete membership payments
      await db.query("DELETE FROM membership_payments WHERE customer_id = ?", [
        customerId,
      ]);

      // Delete family members
      await db.query("DELETE FROM family_members WHERE customer_id = ?", [
        customerId,
      ]);

      // Delete claims related to customer
      await db.query("DELETE FROM claims WHERE customer_id = ?", [customerId]);

      // Delete customer
      await db.query("DELETE FROM customers WHERE id = ?", [customerId]);
    }

    //delete

    // 8. Finally delete the user
    await db.query("DELETE FROM users WHERE id = ?", [id]);

    // Commit transaction
    await connection.commit();

    res.json({ message: "User and all related data deleted successfully." });
  } catch (err) {
    console.error(err);
    await connection.rollback(); // Rollback if error
    res
      .status(500)
      .json({ message: "Error deleting user.", error: err.message });
  }
};

module.exports = { updateUser, deleteUser };
