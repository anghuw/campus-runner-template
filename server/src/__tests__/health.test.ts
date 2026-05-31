/**
 * Minimal health check test
 * Run: npm test (in server/)
 * Requires: server must be running (npm run dev)
 */

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function testHealth() {
  try {
    const res = await fetch(`${BASE}/api/health`);
    const data = (await res.json()) as { status: string };

    if (res.status !== 200) {
      console.error(`❌ Health check failed: status ${res.status}`);
      process.exit(1);
    }

    if (data.status !== 'ok') {
      console.error('❌ Health check failed: unexpected response', data);
      process.exit(1);
    }

    console.log('✅ GET /api/health — passed');
  } catch {
    console.error(`❌ Health check failed: server not running at ${BASE}`);
    console.error('   Start the server first: npm run dev');
    process.exit(1);
  }
}

testHealth();
