import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { store, startDate, endDate, channel } = req.query;

  let query = `
    SELECT 
      s.name AS store,
      c.name AS channel,
      COALESCE(SUM(sa.value_paid), 0) AS revenue
    FROM sales sa
    JOIN stores s ON sa.store_id = s.id
    JOIN channels c ON sa.channel_id = c.id
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

  if (channel) {
    params.push(channel);
    query += ` AND c.name = $${params.length}`;
  }

  query += `
    GROUP BY s.name, c.name
    ORDER BY s.name, revenue DESC;
  `;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar resumo de vendas:", err);
    res.status(500).json({ message: "Erro ao buscar resumo de vendas" });
  }
});

export default router;
