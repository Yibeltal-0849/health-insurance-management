const db = require("../config/db");
const calculateAge = require("../helpers/calculateAge");

const registerCustomer = async (req, res) => {
  try {
    const {
      user_id,
      kebele_id = null,
      woreda_id = null,
      first_name,
      last_name,
      date_of_birth,
      gender,
      family_size,
      phone_number,
      insurance_status,
      is_member,
    } = req.body;

    const age = calculateAge(date_of_birth); //calculate age automatic
    //  Get uploaded photo filename
    const photoPath = req.file ? "/uploads/photos/" + req.file.filename : null; //use when you accept from form

    const [result] = await db.execute(
      `
     INSERT INTO customers (
  user_id, kebele_id, woreda_id,first_name, last_name, gender, date_of_birth, age,
  family_size, phone_number, insurance_status, is_member, photo
) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        kebele_id || null,
        woreda_id || null,
        first_name,
        last_name,
        gender,
        date_of_birth,
        age,
        family_size,
        phone_number,
        insurance_status || "inactive",
        is_member,
        photoPath,
      ]
    );

    res.status(201).json({
      message: "Customer registered",
      customer_id: result.insertId,
    });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ error: "Failed to register customer" });
  }
};

module.exports = registerCustomer;
