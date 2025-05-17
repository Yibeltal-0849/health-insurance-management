const express = require("express");
const router = express.Router();

//register location
const {
  registerSubCity,
  createRegion,
  createZone,
  createWoreda,
  createKebele,
} = require("../controllers/locationController");
//authentication
const {
  authenticate,
  canRegisterRegion,
  canRegisterZone,
  canRegisterWoreda,
  canRegisterKebele,
} = require("../middlewares/authMiddleware");

// Routes

router.post("/sub-cities/register", authenticate, registerSubCity);
router.post("/regions/register", authenticate, canRegisterRegion, createRegion);
router.post("/zones/register", authenticate, canRegisterZone, createZone);
router.post("/woredas/register", authenticate, canRegisterWoreda, createWoreda);
router.post("/kebeles/register", authenticate, canRegisterKebele, createKebele);

module.exports = router;
