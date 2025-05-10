const db = require("../config/db");

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, first_name, last_name, email } = req.body;

  if (!username || !first_name || !last_name || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [result] = await db.execute(
      `UPDATE users 
       SET username = ?, first_name = ?, last_name = ?, email = ?, updated_at = NOW() 
       WHERE id = ?`,
      [username, first_name, last_name, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User updated successfully." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Username or email already taken." });
    }

    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error." });
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

//update user status
const updateUserStatus = async (req, res) => {
  const userId = req.params.id; //select user id
  const { status } = req.body; //select active or inactive from request body

  const validStatuses = ["active", "inactive"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [result] = await db.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `User ${status}d successfully.` });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//select user based on role and status
const getUsersByRoleAndStatus = async (req, res) => {
  const { role, status } = req.query;

  if (!role || !status) {
    return res.status(400).json({ message: "Role and status are required" });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, username, first_name, last_name, email, customer_type, health_facility_id, role, kebele_id, status, created_at, updated_at FROM users WHERE role = ? AND status = ?`,
      [role, status]
    );

    res.json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserStatus = async (req, res) => {
  try {
    // Await and destructure the rows from each query result
    const [[totalResult]] = await db.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [breakdownResults] = await db.query(`
      SELECT customer_type, status, COUNT(*) AS count
      FROM users
      GROUP BY customer_type, status
    `);

    res.json({
      total_users: totalResult.total_users,
      breakdown: breakdownResults,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Report payment information based on optional filters: status and customer type
const getPaymentReport = async (request, response) => {
  try {
    // Extract optional query parameters from the URL (e.g., ?status=completed&customerType=paid)
    const { status, customerType } = request.query;

    // Base SQL query to fetch payment information along with user and customer details
    let query = `
      SELECT 
        membership_payments.id AS payment_id,                
        membership_payments.amount,                         
        membership_payments.status,               
        membership_payments.payment_method,       
        membership_payments.payment_date,                 
        membership_payments.expired_date,                   
        membership_payments.transaction_reference,           
        users.customer_type,                                 
        users.username,                                      
        customers.first_name,                               
        customers.last_name                                  
      FROM membership_payments
      JOIN customers ON membership_payments.customer_id = customers.id 
      JOIN users ON customers.user_id = users.id                       
      WHERE 1=1                                                     
    `;

    // Array to hold parameters for the SQL query (for secure binding)
    const queryParameters = [];

    // If a status filter is provided, add it to the SQL query and parameters
    if (status) {
      query += " AND membership_payments.status = ?";
      queryParameters.push(status);
    }

    // If a customer type filter is provided, add it to the SQL query and parameters
    if (customerType) {
      query += " AND users.customer_type = ?";
      queryParameters.push(customerType);
    }

    // Sort results by most recent payment date
    query += " ORDER BY membership_payments.payment_date DESC";

    // Execute the SQL query with bound parameters to prevent SQL injection
    const [paymentResults] = await db.execute(query, queryParameters);

    // Return the result as a JSON response to the client
    response.status(200).json({ success: true, data: paymentResults });
  } catch (error) {
    // Log any errors that occur and return a generic server error message
    console.error("Error generating payment report:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  updateUserStatus,
  getUsersByRoleAndStatus,
  getUserStatus,
  getPaymentReport,
};
