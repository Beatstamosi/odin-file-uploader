import { Client } from "pg";
import "dotenv/config";

const createUsers = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(150) NOT NULL,
    lastName VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    member BOOL DEFAULT false,
    admin BOOL DEFAULT false
);
`;

const createMessages = `
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
`;

async function main() {
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  });

  console.log("Connecting");
  await client.connect();
  console.log("Running Queries.");
  await client.query(createUsers);
  console.log("Created Users.");
  await client.query(createMessages);
  console.log("Created Messages");
  await client.end();
  console.log("Done");
}

main();
