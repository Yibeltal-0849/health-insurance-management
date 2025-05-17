const db = require("../config/db");

// Register Health Facility
exports.createHealthCenter = async (req, res) => {
  const {
    name,
    type,
    sub_city_id,
    region_id,
    zone_id,
    woreda_id,
    kebele_id,
    status, // optional
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO health_facilities 
      (name, type,sub_city_id, region_id, zone_id, woreda_id, kebele_id, status) 
      VALUES (?, ?, ?, ?, ?, ?,?, ?)`,
      [
        name,
        type,
        sub_city_id || null,
        region_id || null,
        zone_id || null,
        woreda_id || null,
        kebele_id || null,
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
    sub_city_id = null,
    region_id = null,
    zone_id = null,
    woreda_id = null,
    kebele_id = null,
    status = "active",
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO health_facilities 
      (name, type,sub_city_id, region_id, zone_id, woreda_id, kebele_id, status) 
      VALUES (?, ?, ?, ?,?, ?, ?, ?)`,
      [
        name,
        type,
        sub_city_id,
        region_id,
        zone_id,
        woreda_id,
        kebele_id,
        status,
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
