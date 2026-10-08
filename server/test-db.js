const { Client } = require('pg');
require('dotenv').config();

const url = process.env.DATABASE_URL;
// Fix URL password manually for testing if needed
const fixedUrl = url.replace('3KU+3f:2*y*%Phm', encodeURIComponent('3KU+3f:2*y*%Phm'));

const client = new Client({
  connectionString: fixedUrl,
});

async function test() {
  try {
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    await client.end();
  }
}

test();
