const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

const {
  authenticate,

  canRegisterRegionalManager,

  canRegisterZoneManager,
  canRegisterHospitalOfficer,
  canRegisterHealthCenterOfficer,

  canRegisterWoredaManager,

  canRegisterKebeleOfficer,
  canRegisterCustomer,
} = require("../middlewares/authMiddleware");

// Admin routes
// router.post("/regions", authenticate, canRegisterRegion,createRegion);

router.post(
  "/regional-managers/register",
  authenticate,
  canRegisterRegionalManager,
  register
);

// Regional manager routes

router.post(
  "/zone-managers/register",
  authenticate,
  canRegisterZoneManager,
  register
);

router.post(
  "/health-care-officers/register",
  authenticate,
  canRegisterHospitalOfficer,
  register
);

// Zone manager routes
router.post(
  "/woreda-managers/register",
  authenticate,
  canRegisterWoredaManager,
  register
);
router.post(
  "/health-care-officer/register",
  authenticate,
  canRegisterHealthCenterOfficer,
  register
);

// Woreda manager routes
router.post(
  "/kebele-managers/register",
  authenticate,
  canRegisterKebeleOfficer,
  register
);
//register role based customers
router.post("/customers/register", authenticate, canRegisterCustomer, register);

router.post("/subCity-manager/register", authenticate, register);

//regular user login route
router.post("/login", login);

module.exports = router;
