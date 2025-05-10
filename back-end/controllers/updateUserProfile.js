// const db = require("../config/db"); // adjust this path to your DB config

// const updateUserProfile = async (req, res) => {
//   const { id } = req.params;
//   const { username, first_name, last_name, email } = req.body;

//   if (!username || !first_name || !last_name || !email) {
//     return res.status(400).json({ error: "All fields are required." });
//   }

//   try {
//     const [result] = await db.execute(
//       `UPDATE users 
//        SET username = ?, first_name = ?, last_name = ?, email = ?, updated_at = NOW() 
//        WHERE id = ?`,
//       [username, first_name, last_name, email, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     res.json({ message: "User updated successfully." });
//   } catch (error) {
//     if (error.code === "ER_DUP_ENTRY") {
//       return res
//         .status(409)
//         .json({ error: "Username or email already taken." });
//     }

//     console.error("Update error:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// module.exports = { updateUserProfile };
