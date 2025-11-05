import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM stores WHERE is_active = true ORDER BY name;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar lojas:", err);
    res.status(500).json({ message: "Erro ao buscar lojas" });
  }
});

export default router;
