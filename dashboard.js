let authMode = 'login';

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('auth-toggle-btn');
    const toggleText = document.getElementById('auth-toggle-text');

    if (authMode === 'signup') {
        title.innerText = "계정 생성";
        desc.innerText = "CloudPress의 혁신적인 인프라를 경험하세요.";
        submitBtn.innerText = "회원가입 시작";
        toggleBtn.innerText = "로그인";
        toggleText.innerText = "이미 계정이 있으신가요?";
    } else {
        title.innerText = "반가워요!";
        desc.innerText = "계정 정보를 입력하여 접속하세요.";
        submitBtn.innerText = "로그인";
        toggleBtn.innerText = "회원가입";
        toggleText.innerText = "아직 계정이 없으신가요?";
    }
}

async function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await res.json();

        if (result.success) {
            if (authMode === 'login') {
                location.href = '/dashboard.html';
            } else {
                alert("가입 성공! 이제 로그인해 주세요.");
                toggleAuthMode();
            }
        } else {
            alert(result.error || "인증 오류가 발생했습니다.");
        }
    } catch (e) {
        alert("서버와 통신할 수 없습니다.");
    }
}

// 모달 제어
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// 로그아웃
function logout() {
    document.cookie = "session=; Max-Age=0; path=/;";
    location.href = "/";
}
