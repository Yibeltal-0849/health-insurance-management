// authMiddleware.js

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "your_secret_key";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT verify error:", err.message); // 🔍 for debugging
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 2. Basic role checking: one or more allowed roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

// 3. Specific permission helpers (optional but clean)
const canRegisterRegion = authorizeRoles("admin");
const canRegisterRegionalManager = authorizeRoles("admin");
const canUpdateRegion = authorizeRoles("admin");
const canDeleteRegion = authorizeRoles("admin");
const canUpdateRegionalManager = authorizeRoles("admin");
const canDeleteRegionalManager = authorizeRoles("admin");

const canRegisterZone = authorizeRoles("regional_health_bureau");
const canRegisterZoneManager = authorizeRoles("regional_health_bureau");
const canRegisterHospital = authorizeRoles("regional_health_bureau");
const canRegisterHospitalOfficer = authorizeRoles("regional_health_bureau");
const canUpdateZoneManager = authorizeRoles("regional_health_bureau");
const canDeleteZoneManager = authorizeRoles("regional_health_bureau");

const canRegisterWoreda = authorizeRoles("zone_health_officer");
const canRegisterHealthCenter = authorizeRoles("zone_health_officer");
const canRegisterHealthCenterOfficer = authorizeRoles("zone_health_officer");
const canUpdateWoredaManager = authorizeRoles("zone_health_officer");
const canDeleteWoredaManager = authorizeRoles("zone_health_officer");

const canRegisterWoredaManager = authorizeRoles("zone_health_officer");

const canRegisterKebele = authorizeRoles("woreda_health_officer");
const canRegisterKebeleOfficer = authorizeRoles("woreda_health_officer");
const canUpdateKebeleOfficer = authorizeRoles("woreda_health_officer");
const canDeleteKebeleOfficer = authorizeRoles("woreda_health_officer");

const canRegisterCustomer = authorizeRoles("kebele_health_officer");
const canRegisterFamilyMember = authorizeRoles("kebele_health_officer");

module.exports = {
  authenticate,
  authorizeRoles,
  canRegisterRegion,
  canRegisterRegionalManager,
  canUpdateRegionalManager,
  canDeleteRegionalManager,
  canUpdateZoneManager,
  canDeleteZoneManager,
  canRegisterZone,
  canRegisterZoneManager,
  canRegisterHospital,
  canRegisterHospitalOfficer,
  canRegisterWoreda,
  canUpdateWoredaManager,
  canDeleteWoredaManager,
  canRegisterHealthCenter,
  canRegisterHealthCenterOfficer,
  canRegisterWoredaManager,
  canRegisterKebele,
  canRegisterKebeleOfficer,
  canUpdateKebeleOfficer,
  canDeleteKebeleOfficer,
  canRegisterCustomer,
  canRegisterFamilyMember,
};
