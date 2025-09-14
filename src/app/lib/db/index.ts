import { Pool } from "pg";

const connectionString = process.env.connectionString;
console.log(connectionString)
const pool = new Pool({
  connectionString,
});


export default pool;