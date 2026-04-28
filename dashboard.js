async function loadHostings() {
    const list = document.getElementById('hosting-list');
    // 실제로는 API 호출을 통해 데이터를 가져옵니다.
    const mockData = [{ id: 'site_1', name: '내 블로그', domain: 'my-blog.com', status: 'active' }];
    
    list.innerHTML = mockData.map(h => `
        <div class="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl transition-all cursor-pointer" onclick="location.href='/hosting-detail.html?id=${h.id}'">
            <div class="flex justify-between items-start mb-4">
                <span class="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full uppercase">Running</span>
                <i class="fa-solid fa-ellipsis text-slate-300"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-1">${h.name}</h3>
            <p class="text-slate-400 text-sm font-medium">${h.domain}</p>
        </div>
    `).join('');
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', loadHostings);
