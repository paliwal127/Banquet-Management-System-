const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { Pool } = require('pg');

console.log('DB env types:', {
  DB_USER_type: typeof process.env.DB_USER,
  DB_HOST_type: typeof process.env.DB_HOST,
  DB_NAME_type: typeof process.env.DB_NAME,
  DB_PASSWORD_type: typeof process.env.DB_PASSWORD,
  DB_PORT_type: typeof process.env.DB_PORT
});

const pool = new Pool({
  user: String(process.env.DB_USER || ''),
  host: String(process.env.DB_HOST || ''),
  database: String(process.env.DB_NAME || ''),
  password: String(process.env.DB_PASSWORD || ''),
  port: Number(process.env.DB_PORT) || 5432
});

const LOCATIONS = ['Indoor', 'Outdoor', 'Hybrid'];

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  try {
    console.log('Seeding 100 venues...');
    for (let i = 100; i < 200; i++) {
      const id = `V${i}`;
      const name = `Venue ${i}`;
      const max_capacity = randInt(50, 1000);
      const location_type = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const base_rent = (randInt(10000, 120000) + Math.random()).toFixed(2);
      const status = 'Active';

      await pool.query(
        `INSERT INTO venues (id, name, max_capacity, location_type, base_rent, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [id, name, max_capacity, location_type, base_rent, status]
      );

      if ((i - 99) % 10 === 0) {
        console.log(`Inserted ${i - 99} venues...`);
      }
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

seed();
