const express = require("express");
const router = express.Router();
const { updateUser, deleteUser } = require("../controllers/userController");
const {
  authenticate,
  canUpdateZoneManager,
  canDeleteZoneManager,
} = require("../middlewares/authMiddleware");

const { register } = require("../controllers/authController");

const { createKebele } = require("../controllers/locationController");

const Hospital = require("../controllers/healthFacilityController");
const HealthCenter = require("../controllers/healthFacilityController"); // Update user
router.put("/:id", authenticate, canUpdateZoneManager, updateUser);

// Delete user
router.delete("/:id", authenticate, canDeleteZoneManager, deleteUser);

//register regional kebele
router.post("/regional-kebele/register", authenticate, createKebele);

//register regional hospital
router.post(
  "/regional-hospital/register",
  authenticate,
  Hospital.createHospital
);

//register regional health center
router.post(
  "/regional-health-center/register",
  authenticate,
  HealthCenter.createHealthCenter
);

//register regional hospital health officer
router.post(
  "/regional-hospital-health-officer/register",
  authenticate,
  register
);

//register regional kebele health officer
router.post("/regional-kebele-health-officer/register", authenticate, register);

module.exports = router;
