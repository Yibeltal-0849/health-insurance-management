const db = require("../config/db");
// register subCity in federal
const registerSubCity = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ error: "Sub city name is required" });

  try {
    const [existing] = await db.query(
      "SELECT * FROM sub_cities WHERE name = ?",
      [name]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Sub city already exists" });
    }

    await db.query("INSERT INTO sub_cities (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Sub city registered successfully" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register Region
const createRegion = async (req, res) => {
  const { name, code } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO regions (name, code) VALUES (?, ?)",
      [name, code]
    );
    res
      .status(201)
      .json({ message: "Region created", regionId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register Zone
const createZone = async (req, res) => {
  const { name, region_id } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO zones (name, region_id) VALUES (?, ?)",
      [name, region_id]
    );
    res.status(201).json({ message: "Zone created", zoneId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register Woreda
const createWoreda = async (req, res) => {
  const { name, zone_id, sub_city_id } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO woredas (name, zone_id, sub_city_id) VALUES (?, ?, ?)",
      [name, zone_id || null, sub_city_id || null]
    );
    res
      .status(201)
      .json({ message: "Woreda created", woredaId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register Kebele
const createKebele = async (req, res) => {
  const {
    name,
    code,
    region_id = null,
    zone_id = null,
    woreda_id = null,
  } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO kebeles (name, code,region_id,zone_id, woreda_id) VALUES (?, ?,?,?, ?)",
      [name, code, region_id, zone_id, woreda_id]
    );
    res
      .status(201)
      .json({ message: "Kebele created", kebeleId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerSubCity,
  createRegion,
  createZone,
  createWoreda,
  createKebele,
};
