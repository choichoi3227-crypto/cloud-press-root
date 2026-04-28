// 인스턴스별 리소스 사용량 차트 렌더링 함수
async function renderUsageChart(canvasId, hostingId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // D1 API로부터 최근 10개의 통계 데이터 가져오기
    try {
        const response = await fetch(`/api/stats/${hostingId}`);
        const stats = await response.json();
        
        const labels = stats.map(s => new Date(s.timestamp).toLocaleTimeString());
        const cpuData = stats.map(s => s.cpu_usage);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.reverse(),
                datasets: [{
                    label: 'CPU 사용량 (%)',
                    data: cpuData.reverse(),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { display: false } }
                }
            }
        });
    } catch (e) {
        console.error("차트 로딩 실패:", e);
    }
}

async function loadHostings() {
    const list = document.getElementById('hosting-list');
    // 실제 운영 시 /api/user/hostings 호출
    const mockHostings = [
        { id: 'site_1', name: '기술 블로그', domain: 'tech.blog' },
        { id: 'site_2', name: '포트폴리오', domain: 'me.dev' }
    ];
    
    list.innerHTML = mockHostings.map(h => `
        <div class="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl transition-all">
            <div class="flex justify-between items-start mb-4">
                <span class="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full uppercase">Active</span>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-1">${h.name}</h3>
            <p class="text-slate-400 text-sm font-medium mb-4">${h.domain}</p>
            
            <!-- 리소스 차트 영역 -->
            <div class="h-20 w-full mb-4">
                <canvas id="chart-${h.id}"></canvas>
            </div>

            <button onclick="location.href='/hosting-detail.html?id=${h.id}'" class="w-full py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100">관리하기</button>
        </div>
    `).join('');

    // 카드 생성 후 차트 초기화
    mockHostings.forEach(h => renderUsageChart(`chart-${h.id}`, h.id));
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', loadHostings);
