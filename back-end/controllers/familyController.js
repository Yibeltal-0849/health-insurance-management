const db = require("../config/db");
const calculateAge = require("../helpers/calculateAge");

const registerFamilyMember = async (req, res) => {
  try {
    const {
      customer_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      relationship,
      insurance_status,
    } = req.body;

    const age = calculateAge(date_of_birth);
    //  Get uploaded photo filename
    const photoPath = req.file ? "/uploads/photos/" + req.file.filename : null;

    const [result] = await db.execute(
      `
      INSERT INTO family_members (
        customer_id, first_name, last_name, date_of_birth, age,
        gender, relationship, insurance_status, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer_id,
        first_name,
        last_name,
        date_of_birth,
        age,
        gender,
        relationship,
        insurance_status || "inactive",
        photoPath,
      ]
    );

    res.status(201).json({
      message: "Family member registered",
      family_member_id: result.insertId,
    });
  } catch (error) {
    console.error("Error registering family member:", error);
    res.status(500).json({ error: "Failed to register family member" });
  }
};

module.exports = registerFamilyMember;
