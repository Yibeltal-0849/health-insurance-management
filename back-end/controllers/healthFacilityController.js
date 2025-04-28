const db = require("../config/db");

// Register Health Facility
exports.createHealthCenter = async (req, res) => {
  const {
    name,
    type,
    region_id,
    zone_id,
    woreda_id,
    kebele_id,
    created_by, // can be hardcoded or fetched from logged-in user
    status, // optional
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO health_facilities 
      (name, type, region_id, zone_id, woreda_id, kebele_id, created_by, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        region_id,
        zone_id,
        woreda_id,
        kebele_id,
        created_by,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Health facility registered",
      facilityId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createHospital = async (req, res) => {
  const {
    name,
    type,
    region_id,
    zone_id,
    woreda_id,
    kebele_id,
    created_by, 
    status, 
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO health_facilities 
      (name, type, region_id, zone_id, woreda_id, kebele_id, created_by, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        region_id,
        zone_id,
        woreda_id,
        kebele_id,
        created_by,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Hospitals are registered",
      hospitalId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};