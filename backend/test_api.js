// CaseIQ Backend Complete Verification Test Suite
process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./server');

const PORT = 5555;

let server;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(data);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting CaseIQ Backend E2E Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Start test server
  server = app.listen(PORT);

  try {
    // 1. Health Check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'healthy', 'GET /api/health');

    // 2. Auth - Register
    const testEmail = `lawyer_${Date.now()}@caseiq.legal`;
    const regRes = await request('POST', '/api/auth/register', {
      fullName: 'Adv. Test User',
      email: testEmail,
      password: 'password123',
      role: 'Advocate',
      organization: 'High Court of Delhi'
    });
    assert(regRes.status === 201 && regRes.body.token && !regRes.body.user.password, 'POST /api/auth/register returns 201 + token + safe user');
    const token = regRes.body.token;

    // 3. Auth - Login
    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'password123'
    });
    assert(loginRes.status === 200 && loginRes.body.token && !loginRes.body.user.password, 'POST /api/auth/login returns 200 + token + safe user');

    // 4. Auth - Invalid Login
    const invalidLogin = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'wrongpassword'
    });
    assert(invalidLogin.status === 401 && invalidLogin.body.message === 'Invalid credentials', 'POST /api/auth/login returns 401 on invalid credentials');

    // 5. Auth - Me
    const meRes = await request('GET', '/api/auth/me', null, token);
    assert(meRes.status === 200 && meRes.body.user && !meRes.body.user.password, 'GET /api/auth/me returns 200 + safe user');

    // 6. Auth - Profile Update
    const profPut = await request('PUT', '/api/profile', { organization: 'Supreme Court Bar' }, token);
    assert(profPut.status === 200 && profPut.body.profile.organization === 'Supreme Court Bar', 'PUT /api/profile updates profile');

    // 7. Auth - Logout & Forgot Password
    const logoutRes = await request('POST', '/api/auth/logout', {}, token);
    assert(logoutRes.status === 200 && logoutRes.body.success, 'POST /api/auth/logout returns 200');

    const forgotRes = await request('POST', '/api/auth/forgot-password', { email: testEmail });
    assert(forgotRes.status === 200 && forgotRes.body.success, 'POST /api/auth/forgot-password returns 200');

    // 8. Cases - List
    const casesRes = await request('GET', '/api/cases');
    assert(casesRes.status === 200 && casesRes.body.cases && casesRes.body.cases.length > 0, 'GET /api/cases returns list of cases');

    // 9. Case Details - GET /api/cases/:id
    const caseDetails = await request('GET', '/api/cases/case-puttaswamy');
    assert(
      caseDetails.status === 200 &&
      caseDetails.body.name &&
      caseDetails.body.court &&
      caseDetails.body.year &&
      caseDetails.body.importantFacts &&
      caseDetails.body.reasoning,
      'GET /api/cases/:id returns complete Case schema with all fields'
    );

    // 10. Case Precedents - GET /api/cases/:id/precedents
    const precedentsRes = await request('GET', '/api/cases/case-puttaswamy/precedents');
    assert(
      precedentsRes.status === 200 &&
      Array.isArray(precedentsRes.body) &&
      precedentsRes.body.length > 0 &&
      precedentsRes.body.every(p => ['Followed', 'Referred', 'Distinguished', 'Overruled'].includes(p.relationshipType)),
      'GET /api/cases/:id/precedents returns valid precedent relationships'
    );

    // 11. Precedent Graph - GET /api/cases/relationships
    const relsRes = await request('GET', '/api/cases/relationships');
    assert(relsRes.status === 200 && relsRes.body.relationships.length > 0, 'GET /api/cases/relationships returns graph');

    // 12. Saved Cases - POST, GET, DELETE
    const saveRes = await request('POST', '/api/saved-cases', { caseId: 'case-puttaswamy' }, token);
    assert(saveRes.status === 201 || saveRes.status === 200, 'POST /api/saved-cases saves case');

    const getSavedRes = await request('GET', '/api/saved-cases', null, token);
    assert(Array.isArray(getSavedRes.body) && getSavedRes.body.some(s => s.caseId === 'case-puttaswamy'), 'GET /api/saved-cases returns saved cases');

    const deleteSavedRes = await request('DELETE', '/api/saved-cases/case-puttaswamy', null, token);
    assert(deleteSavedRes.status === 200 && deleteSavedRes.body.success, 'DELETE /api/saved-cases/:caseId removes case');

    // 13. Dashboard - Stats, Recent Searches, Research History
    const statsRes = await request('GET', '/api/dashboard/stats', null, token);
    assert(
      statsRes.status === 200 &&
      typeof statsRes.body.searches === 'number' &&
      typeof statsRes.body.saved === 'number',
      'GET /api/dashboard/stats returns aggregate stats'
    );

    const recentSearchRes = await request('GET', '/api/dashboard/recent-searches', null, token);
    assert(Array.isArray(recentSearchRes.body), 'GET /api/dashboard/recent-searches returns paginated array');

    const historyRes = await request('GET', '/api/dashboard/research-history', null, token);
    assert(Array.isArray(historyRes.body), 'GET /api/dashboard/research-history returns paginated history');

    // 14. Law Comparison - POST /api/law-comparison
    const lawCompRes = await request('POST', '/api/law-comparison', { section: '302' });
    assert(
      lawCompRes.status === 200 &&
      lawCompRes.body.oldLaw &&
      lawCompRes.body.newLaw &&
      lawCompRes.body.whatChanged,
      'POST /api/law-comparison returns real statutory reform comparison'
    );

    const notFoundComp = await request('POST', '/api/law-comparison', { section: 'nonexistent-9999' });
    assert(notFoundComp.status === 404, 'POST /api/law-comparison returns 404 for unknown section');

    // 15. Search - POST /api/search/legal & GET /api/search
    const postSearch = await request('POST', '/api/search/legal', { query: 'Right to Privacy Article 21' }, token);
    assert(postSearch.status === 200 && postSearch.body.results.length > 0, 'POST /api/search/legal returns results');

    const emptySearch = await request('POST', '/api/search/legal', { query: '' }, token);
    assert(emptySearch.status === 200 && emptySearch.body.results.length === 0, 'Empty search query returns 200 + empty array');

    // 16. Acts & Sections
    const actsRes = await request('GET', '/api/acts');
    assert(actsRes.status === 200 && actsRes.body.acts.length > 0, 'GET /api/acts returns statutory acts');

    const actById = await request('GET', '/api/acts/act-bns');
    assert(actById.status === 200 && actById.body.act && actById.body.sections.length > 0, 'GET /api/acts/:id returns act with sections');

    // 17. AI 5-Pillar Analysis
    const aiRes = await request('POST', '/api/ai/case-analysis', { caseId: 'case-puttaswamy' }, token);
    assert(
      aiRes.status === 200 &&
      aiRes.body.analysis &&
      aiRes.body.analysis.facts &&
      aiRes.body.analysis.decision,
      'POST /api/ai/case-analysis returns 5-pillar analysis'
    );

    // 18. Community Posts & Comments
    const postsRes = await request('GET', '/api/community/posts');
    assert(postsRes.status === 200 && Array.isArray(postsRes.body.posts), 'GET /api/community/posts returns discussions');

    console.log(`\n--- Test Suite Summary: ${passed} Passed, ${failed} Failed ---`);
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  } catch (err) {
    console.error('Test suite error:', err);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
