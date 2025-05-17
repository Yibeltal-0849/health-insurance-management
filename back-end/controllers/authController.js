const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logUserAction } = require("../helpers/logHelper");

// Register User not location based
/* const register = async (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    health_facility,
    role,
    customer_type,
    kebele_id,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await pool.execute(
      "INSERT INTO users (username, first_name, last_name, email, password,health_facility_id, role, customer_type,kebele_id, status) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?)",
      [
        username,
        first_name,
        last_name,
        email,
        hashedPassword,
        health_facility || null,
        role,
        customer_type || null,
        kebele_id || null,
        "pending",
      ]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", userId: rows.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
}; */

//

const register = async (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    health_facility,
    role,
    customer_type,
    sub_city_id,
    kebele_id,
    woreda_id,
    zone_id,
    region_id,
  } = req.body;

  try {
    // Role-based validation for required IDs
    if (role === "regional_health_bureau" && !region_id) {
      return res
        .status(400)
        .json({ message: "Region ID is required for regional health officer" });
    }
    if (role === "SubCity_health_officer" && !sub_city_id) {
      return res
        .status(400)
        .json({
          message: "sub city ID is required for federal subCity health officer",
        });
    }
    if (role == "SubCity_health_officer" && !sub_city_id) {
      return res.status().json({
        message: "sub city ID is required for sub city health officer",
      });
    }
    if (role == "federal_woreda_health_officer" && !federal_woreda_id) {
      return res.status().json({
        message: "federal woreda id is required for federal woreda health ",
      });
    }
    if (role === "zone_health_officer" && !zone_id) {
      return res.status(400).json({
        message: "Zone ID are required for zone health officer",
      });
    }
    if (role === "woreda_health_officer" && !woreda_id) {
      return res.status(400).json({
        message: "Woreda ID are required for woreda health officer",
      });
    }
    if (role === "kebele_health_officer" && !kebele_id) {
      return res.status(400).json({
        message: "Kebele ID are required for kebele health officer",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const [rows] = await pool.execute(
      `INSERT INTO users 
        (username, first_name, last_name, email, password, health_facility_id, role, customer_type,sub_city_id, kebele_id, woreda_id, zone_id, region_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        username,
        first_name,
        last_name,
        email,
        hashedPassword,
        health_facility || null,
        role,
        customer_type || null,
        sub_city_id || null,
        kebele_id || null,
        woreda_id || null,
        zone_id || null,
        region_id || null,
        "pending",
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: rows.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);
//     const user = users[0];

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Role-based redirect path
//     let redirectPath = "/";
//     switch (user.role) {
//       case "admin":
//         redirectPath = "/admin/dashboard";
//         break;
//       case "regional_health_bureau":
//         redirectPath = "/regional_health_bureau/dashboard";
//         break;
//       case "hospital_health_officer":
//         redirectPath = "/hospital_health_officer/dashboard";
//         break;
//       case "zone_health_officer":
//         redirectPath = "/zone_health_officer/dashboard";
//         break;
//       case "woreda_health_officer":
//         redirectPath = "/woreda_health_officer/dashboard";
//         break;
//       case "customer":
//         redirectPath = "/customer/dashboard";
//         break;
//       case "kebele_health_officer":
//         redirectPath = "/kebele_health_officer/dashboard";
//         break;
//       default:
//         redirectPath = "no path";
//     }

//     res.json({
//       message: "Login successful",
//       token,
//       role: user.role,
//       userId: user.id,
//       redirect: redirectPath,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login error" });
//   }
// };

// login with logs

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      await logUserAction(
        null, // user not found, so no userId
        "login_failed",
        `Login failed: email ${email} not found`,
        req.ip //this is return real user ip address after deploy
      );
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logUserAction(
        user.id,
        "login_failed",
        `Login failed: wrong password for ${email}`,
        req.ip
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Role-based redirect path
    let redirectPath = "/";
    switch (user.role) {
      case "admin":
        redirectPath = "/admin/dashboard";
        break;
      case "regional_health_bureau":
        redirectPath = "/regional_health_bureau/dashboard";
        break;
      case "hospital_health_officer":
        redirectPath = "/hospital_health_officer/dashboard";
        break;
      case "zone_health_officer":
        redirectPath = "/zone_health_officer/dashboard";
        break;
      case "woreda_health_officer":
        redirectPath = "/woreda_health_officer/dashboard";
        break;
      case "customer":
        redirectPath = "/customer/dashboard";
        break;
      case "kebele_health_officer":
        redirectPath = "/kebele_health_officer/dashboard";
        break;
      default:
        redirectPath = "no path";
    }

    // Log successful login, you can use later this part
    /* await logUserAction(
      user.id,
      "login_success",
      `Login successful for ${email}`,
      req.ip
    ); */

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user.id,
      redirect: redirectPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error" });
  }
};

module.exports = {
  register,
  login,
};
