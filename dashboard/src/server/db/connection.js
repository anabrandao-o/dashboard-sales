import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "challenge",
  host: "localhost",
  database: "challenge_db",
  password: "challenge_2024",
  port: 5432,
});
export default pool;

