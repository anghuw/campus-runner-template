/**
 * Integration tests for Campus Runner API
 *
 * Requirements: Server must be running (npm run dev)
 * Run: npm test
 */

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001';

interface ApiResponse {
  status: number;
  data: { success: boolean; data: any; message?: string };
}

async function req(path: string, opts: { method?: string; body?: any; token?: string } = {}): Promise<ApiResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  return { status: res.status, data: (await res.json()) as ApiResponse['data'] };
}

let passed = 0;
let failed = 0;

function ok(cond: boolean, msg: string) {
  if (cond) { console.log(`  ✅ ${msg}`); passed++; }
  else { console.error(`  ❌ ${msg}`); failed++; }
}

async function main() {
  console.log('\n🧪 Campus Runner API Integration Tests\n');

  let authToken = '';
  let taskId = '';

  // 1. Health
  console.log('GET /api/health');
  {
    const r = await req('/api/health');
    ok(r.status === 200, 'returns 200');
    ok((r.data as any).status === 'ok', 'status is ok');
  }

  // 2. Register
  console.log('\nPOST /api/auth/register');
  {
    const phone = `138${Date.now().toString().slice(-8)}`;
    const r = await req('/api/auth/register', {
      method: 'POST',
      body: { phone, nickname: '测试用户', password: 'test123456', studentId: '2024999' },
    });
    ok(r.status === 200, 'returns 200');
    ok(r.data.success === true, 'success is true');
    ok(!!r.data.data.token, 'returns token');
  }

  // 3. Login (seed user)
  console.log('\nPOST /api/auth/login');
  {
    const r = await req('/api/auth/login', {
      method: 'POST',
      body: { phone: '13800000001', password: '123456' },
    });
    ok(r.status === 200, 'returns 200');
    ok(r.data.success === true, 'success is true');
    ok(!!r.data.data.token, 'returns token');
    authToken = r.data.data.token;
  }

  // 4. Get me
  console.log('\nGET /api/auth/me');
  {
    const r = await req('/api/auth/me', { token: authToken });
    ok(r.status === 200, 'returns 200');
    ok(r.data.data.phone === '13800000001', 'phone matches');
  }

  // 5. Get me without token → 401
  console.log('\nGET /api/auth/me (no token)');
  {
    const r = await req('/api/auth/me');
    ok(r.status === 401, 'returns 401');
    ok(r.data.success === false, 'success is false');
  }

  // 6. List tasks
  console.log('\nGET /api/tasks');
  {
    const r = await req('/api/tasks');
    ok(r.status === 200, 'returns 200');
    ok(Array.isArray(r.data.data), 'returns array');
  }

  // 7. Create task
  console.log('\nPOST /api/tasks');
  {
    const r = await req('/api/tasks', {
      method: 'POST',
      token: authToken,
      body: {
        title: '测试任务-帮我取快递',
        description: '取件码 8-8-8888',
        type: 'express',
        pickupLocation: '菜鸟驿站',
        deliveryLocation: '7号楼 301',
        reward: 5,
        contactInfo: '13800000001',
      },
    });
    ok(r.status === 200, 'returns 200');
    ok(r.data.data.title === '测试任务-帮我取快递', 'title matches');
    ok(r.data.data.status === 'pending', 'status is pending');
    taskId = r.data.data.id;
  }

  // 8. Create task without token → 401
  console.log('\nPOST /api/tasks (no token)');
  {
    const r = await req('/api/tasks', {
      method: 'POST',
      body: { title: 'x', type: 'express', pickupLocation: 'a', deliveryLocation: 'b', reward: 5, contactInfo: '123' },
    });
    ok(r.status === 401, 'returns 401');
  }

  // 9. Accept task (as user 2)
  console.log('\nPOST /api/tasks/:id/accept');
  {
    const login = await req('/api/auth/login', {
      method: 'POST',
      body: { phone: '13800000002', password: '123456' },
    });
    const user2Token = login.data.data.token;

    const r = await req(`/api/tasks/${taskId}/accept`, {
      method: 'POST',
      token: user2Token,
    });
    ok(r.status === 200, 'returns 200');
    ok(r.data.data.status === 'accepted', 'status is accepted');
    ok(!!r.data.data.runnerId, 'runnerId is set');
  }

  // Summary
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
  console.log('All tests passed! 🎉\n');
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
