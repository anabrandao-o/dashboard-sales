import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { store, startDate, endDate } = req.query;

  let query = `
    SELECT 
      sa.channel,
      COUNT(*) AS count,
      COALESCE(SUM(sa.total_amount), 0) AS revenue
    FROM sales sa
    JOIN stores s ON sa.store_id = s.id
    WHERE 1=1
  `;

  const params = [];

  if (store) {
    params.push(store);
    query += ` AND s.name = $${params.length}`;
  }

  if (startDate) {
    params.push(startDate);
    query += ` AND sa.created_at >= $${params.length}`;
  }

  if (endDate) {
    params.push(endDate);
    query += ` AND sa.created_at <= $${params.length}`;
  }

  query += `
    GROUP BY sa.channel
    ORDER BY revenue DESC;
  `;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar vendas por canal:", err);
    res.status(500).json({ message: "Erro ao buscar vendas por canal" });
  }
});

export default router;
