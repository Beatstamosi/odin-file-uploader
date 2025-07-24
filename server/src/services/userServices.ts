import pool from "../db/pool.js";

export default async function userExists(email: string) {
  const result = await pool.query("SELECT 1 FROM users WHERE email = ($1);", [
    email,
  ]);
  return result.rows.length > 0;
}
