const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const createAndSeedTables = async () => {
  const client = await pool.connect();

  try {
    // Create Reviews Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        author VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Reviews table created successfully.');

    // Seed initial data for Reviews Table
    await client.query(`
      INSERT INTO reviews (product_id, author, rating, comment)
      VALUES
      (1, 'Alice', 5, 'Love this product!'),
      (1, 'Bob', 4, 'Really good, but I expected more features.'),
      (2, 'Charlie', 3, 'The product is okay, quite average.'),
      (3, 'Dave', 2, 'Not what I expected, quite disappointing.')
      ON CONFLICT DO NOTHING;  // This will prevent insertion if the record already exists
    `);
    console.log('Initial data for reviews table inserted successfully.');

    // Add more seeding queries for other tables if necessary
    // ...

  } catch (error) {
    console.error('Error setting up the database:', error);
    throw error;
  } finally {
    client.release(); // Make sure to release the client before finishing
  }
};

createAndSeedTables().then(() => {
  console.log('Database setup and seeding complete');
  pool.end(); // Close the pool after setup is complete
}).catch((err) => {
  console.error('Database setup and seeding failed', err);
  pool.end();
});
