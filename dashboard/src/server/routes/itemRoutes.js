import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { store, startDate, endDate, channel, itemName } = req.query;

  let query = `
    SELECT
      s.name AS store,
      c.name AS channel,
      i.name AS item,
      COALESCE(SUM(ips.quantity * (ips.price + ips.additional_price)), 0) AS revenue,
      COALESCE(SUM(ips.quantity), 0) AS total_quantity
    FROM item_product_sales ips
    JOIN product_sales ps ON ips.product_sale_id = ps.id
    JOIN sales sa ON ps.sale_id = sa.id
    JOIN stores s ON sa.store_id = s.id
    JOIN channels c ON sa.channel_id = c.id
    JOIN items i ON ips.item_id = i.id
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

  if (itemName) {
    params.push(itemName);
    query += ` AND i.name ILIKE $${params.length}`;
  }

  query += `
    GROUP BY s.name, c.name, i.name
    ORDER BY s.name, revenue DESC;
  `;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar resumo de vendas por item:", err);
    res.status(500).json({ message: "Erro ao buscar resumo de vendas por item" });
  }
});

export default router;
