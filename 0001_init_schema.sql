-- CloudPress D1 초기 스키마
-- 실행 방법: wrangler d1 execute cp_main_db --env admin --file=./migrations/0001_init_schema.sql

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    email     TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    role      TEXT    NOT NULL DEFAULT 'user',  -- 'admin' | 'user'
    created_at TEXT   NOT NULL DEFAULT (datetime('now'))
);

-- 호스팅(사이트) 테이블
CREATE TABLE IF NOT EXISTS hostings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain      TEXT    NOT NULL UNIQUE,
    status      TEXT    NOT NULL DEFAULT 'pending',  -- 'pending' | 'active' | 'suspended'
    plan        TEXT    NOT NULL DEFAULT 'free',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    expires_at  TEXT
);

-- 세션 테이블 (쿠키 기반 인증 보조)
CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT    PRIMARY KEY,   -- UUID
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT    NOT NULL
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email       ON users(email);
CREATE INDEX IF NOT EXISTS idx_hostings_user_id  ON hostings(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id  ON sessions(user_id);
