export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const method = request.method;

        // 회원가입
        if (url.pathname === "/api/auth/signup" && method === "POST") {
            const { email, password } = await request.json();
            try {
                await env.DB.prepare("INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)")
                    .bind(email, password, new Date().toISOString()).run();
                return new Response(JSON.stringify({ success: true }));
            } catch (e) {
                return new Response(JSON.stringify({ success: false, error: "이미 존재하는 이메일입니다." }), { status: 400 });
            }
        }

        // 로그인
        if (url.pathname === "/api/auth/login" && method === "POST") {
            const { email, password } = await request.json();
            const user = await env.DB.prepare("SELECT id FROM users WHERE email = ? AND password = ?")
                .bind(email, password).first();
            
            if (user) {
                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Set-Cookie': `session=${user.id}; Path=/; HttpOnly; SameSite=Lax` }
                });
            }
            return new Response(JSON.stringify({ success: false, error: "정보가 일치하지 않습니다." }), { status: 401 });
        }

        return new Response("CloudPress Engine API", { status: 200 });
    }
};
