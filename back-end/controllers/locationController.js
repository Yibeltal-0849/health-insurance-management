const db = require("../config/db");

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
  const { name, zone_id } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO woredas (name, zone_id) VALUES (?, ?)",
      [name, zone_id]
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
  const { name, code, woreda_id } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO kebeles (name, code, woreda_id) VALUES (?, ?, ?)",
      [name, code, woreda_id]
    );
    res
      .status(201)
      .json({ message: "Kebele created", kebeleId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={
  createRegion,
  createZone,
  createWoreda,
  createKebele
}
