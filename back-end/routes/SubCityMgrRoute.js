const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const { createWoreda } = require("../controllers/locationController");

const Hospital = require("../controllers/healthFacilityController");
const HealthCenter = require("../controllers/healthFacilityController");

router.post("/sub-city-health-officer/users/register", authenticate, register);
router.post("/sub_city_woreda_health_officer/register", authenticate, register);

router.post(
  "/sub-city-hospital/register",
  authenticate,
  Hospital.createHospital
);
router.post(
  "/sub_city_health_center/register",
  authenticate,
  HealthCenter.createHealthCenter
);

router.post("/sub-city-woredas/register", authenticate, createWoreda);

module.exports = router;
