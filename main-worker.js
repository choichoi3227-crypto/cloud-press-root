// ─────────────────────────────────────────────
//  CloudPress · main-worker.js
//  D1 스키마 자동 초기화 + 인증 API
// ─────────────────────────────────────────────

/**
 * D1 테이블이 없을 경우 자동으로 생성합니다.
 * 배포 후 첫 요청 또는 /api/init 호출 시 실행됩니다.
 */
async function initSchema(db) {
    const statements = [
        `CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            email      TEXT    NOT NULL UNIQUE,
            password   TEXT    NOT NULL,
            role       TEXT    NOT NULL DEFAULT 'user',
            created_at TEXT    NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS hostings (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            domain     TEXT    NOT NULL UNIQUE,
            status     TEXT    NOT NULL DEFAULT 'pending',
            plan       TEXT    NOT NULL DEFAULT 'free',
            created_at TEXT    NOT NULL DEFAULT (datetime('now')),
            expires_at TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS sessions (
            id         TEXT    PRIMARY KEY,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TEXT    NOT NULL DEFAULT (datetime('now')),
            expires_at TEXT    NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email)`,
        `CREATE INDEX IF NOT EXISTS idx_hostings_user_id ON hostings(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
    ];

    for (const sql of statements) {
        await db.prepare(sql).run();
    }
}

/** 간단한 JSON 응답 헬퍼 */
const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

export default {
    async fetch(request, env) {
        const url    = new URL(request.url);
        const method = request.method;

        // ── 스키마 수동 초기화 엔드포인트 ──────────────────────────
        // 배포 직후 한 번만 호출: POST /api/init
        // 언제든 호출해도 안전합니다 (IF NOT EXISTS 사용).
        if (url.pathname === '/api/init' && method === 'POST') {
            try {
                await initSchema(env.DB);
                return json({ success: true, message: 'D1 스키마 초기화 완료' });
            } catch (e) {
                return json({ success: false, error: e.message }, 500);
            }
        }

        // ── 회원가입 ────────────────────────────────────────────────
        if (url.pathname === '/api/auth/signup' && method === 'POST') {
            const { email, password } = await request.json();
            try {
                await initSchema(env.DB); // 테이블 없으면 자동 생성
            } catch (_) {}

            try {
                await env.DB
                    .prepare('INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)')
                    .bind(email, password, new Date().toISOString())
                    .run();
                return json({ success: true });
            } catch (e) {
                return json({ success: false, error: '이미 존재하는 이메일입니다.' }, 400);
            }
        }

        // ── 로그인 ──────────────────────────────────────────────────
        if (url.pathname === '/api/auth/login' && method === 'POST') {
            const { email, password } = await request.json();
            try {
                await initSchema(env.DB);
            } catch (_) {}

            const user = await env.DB
                .prepare('SELECT id FROM users WHERE email = ? AND password = ?')
                .bind(email, password)
                .first();

            if (user) {
                return new Response(JSON.stringify({ success: true }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `session=${user.id}; Path=/; HttpOnly; SameSite=Lax`,
                    },
                });
            }
            return json({ success: false, error: '정보가 일치하지 않습니다.' }, 401);
        }

        return new Response('CloudPress Engine API', { status: 200 });
    },
};
