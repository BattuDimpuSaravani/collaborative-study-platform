import pool from "./db.js";

async function testDb() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connected");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
  }
}

testDb();