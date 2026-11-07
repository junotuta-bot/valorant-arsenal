import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ==========================================
// 1. CẤU HÌNH FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDcWUH344NcoLtDULyoh-pZ9yke6_Be7rY",
    authDomain: "coffee-management-5014a.firebaseapp.com",
    projectId: "coffee-management-5014a",
    storageBucket: "coffee-management-5014a.firebasestorage.app",
    messagingSenderId: "482940095539",
    appId: "1:482940095539:web:fb0a40bad1b723b5b0e746",
    measurementId: "G-CRLDVB1SWL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    const userDisplay = document.getElementById('user-display');
    if (user) { 
        if (userDisplay) userDisplay.textContent = `Đặc vụ: ${user.email}`; 
    } else { 
        window.location.href = "login.html"; 
    }
});

window.handleLogout = function() {
    signOut(auth).then(() => { window.location.href = "login.html"; });
};

// ==========================================
// 2. CHUYỂN ĐỔI TAB (Vũ Khí - Đặc Vụ - Giáp)
// ==========================================
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-red-600', 'text-white');
        btn.classList.add('text-gray-400');
    });
    
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-red-600', 'text-white');
        activeBtn.classList.remove('text-gray-400');
    }

    document.getElementById('section-weapons')?.classList.toggle('hidden', tabName !== 'weapons');
    document.getElementById('section-agents')?.classList.toggle('hidden', tabName !== 'agents');
    document.getElementById('section-shields')?.classList.toggle('hidden', tabName !== 'shields');

    const compareBar = document.getElementById('compare-bar');
    if (compareBar) {
        if (tabName !== 'weapons') {
            compareBar.classList.add('hidden');
        } else if (compareList.length > 0) {
            compareBar.classList.remove('hidden');
        }
    }
};

// ==========================================
// 3. LOGIC GỌI TẤT CẢ API (SÚNG, ĐẶC VỤ, GIÁP)
// ==========================================
let allWeapons = [];
let allAgents = [];
let allShields = [];
let currentCategory = 'ALL';
let compareList = [];

async function loadAllValorantData() {
    try {
        const [resWeapons, resAgents, resGear] = await Promise.all([
            fetch('https://valorant-api.com/v1/weapons'),
            fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true'),
            fetch('https://valorant-api.com/v1/gear')
        ]);

        const dataWeapons = await resWeapons.json();
        const dataAgents = await resAgents.json();
        const dataGear = await resGear.json();

        allWeapons = dataWeapons.data || [];
        allAgents = dataAgents.data || [];
        allShields = dataGear.data || [];

        document.getElementById('loading')?.classList.add('hidden');

        renderWeapons(allWeapons);
        renderAgents(allAgents);
        renderShields(allShields);
    } catch (err) {
        console.error("Lỗi tải API", err);
    }
}

// RENDER SÚNG
function renderWeapons(weapons) {
    const grid = document.getElementById('weapons-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    weapons.forEach(gun => {
        const isSelected = compareList.includes(gun.uuid);
        const card = document.createElement('div');
        card.className = `bg-[#16222f] border ${isSelected ? 'border-yellow-400' : 'border-gray-800 hover:border-red-500'} rounded-xl p-4 flex flex-col justify-between transition group relative`;
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-base font-bold text-white uppercase group-hover:text-red-500 transition">${gun.displayName}</h3>
                <button onclick="toggleCompare('${gun.uuid}')" class="text-lg ${isSelected ? 'text-yellow-400' : 'text-gray-500 hover:text-white'}">
                    <i class="fa-solid fa-code-compare"></i>
                </button>
            </div>
            <div class="my-4 h-20 flex items-center justify-center cursor-pointer" onclick="openModal('${gun.uuid}')">
                <img src="${gun.displayIcon}" class="max-h-16 max-w-full drop-shadow group-hover:scale-105 transition">
            </div>
            <button onclick="openModal('${gun.uuid}')" class="w-full bg-[#1e2d3d] group-hover:bg-red-600 text-xs font-semibold py-1.5 rounded text-gray-200 transition">Xem Chỉ Số</button>
        `;
        grid.appendChild(card);
    });
}

// RENDER ĐẶC VỤ
function renderAgents(agents) {
    const grid = document.getElementById('agents-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    agents.forEach(agent => {
        const card = document.createElement('div');
        card.className = "bg-[#16222f] border border-gray-800 hover:border-red-500 rounded-xl p-3 flex flex-col items-center cursor-pointer hover:-translate-y-1 transition duration-200 group text-center";
        card.onclick = () => openAgentModal(agent.uuid);
        card.innerHTML = `
            <div class="w-full aspect-square bg-[#0f1923] rounded-lg p-2 mb-3 flex items-center justify-center overflow-hidden border border-gray-800">
                <img src="${agent.displayIcon}" class="w-full h-full object-contain group-hover:scale-110 transition duration-300">
            </div>
            <span class="text-[10px] font-bold text-red-400 uppercase tracking-widest">${agent.role ? agent.role.displayName : 'Chưa rõ'}</span>
            <h3 class="text-base font-bold text-white uppercase mt-0.5 group-hover:text-red-500 transition">${agent.displayName}</h3>
        `;
        grid.appendChild(card);
    });
}

// RENDER GIÁP
function renderShields(shields) {
    const grid = document.getElementById('shields-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    shields.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-[#16222f] border border-gray-800 hover:border-red-500 rounded-2xl p-6 flex flex-col justify-between transition text-center";
        card.innerHTML = `
            <div>
                <span class="text-xs font-bold text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">${item.shopData ? item.shopData.cost + ' Creds' : 'Miễn phí'}</span>
                <h3 class="text-2xl font-black text-white uppercase mt-4">${item.displayName}</h3>
                <div class="h-32 my-6 flex items-center justify-center">
                    <img src="${item.displayIcon}" class="max-h-28 object-contain">
                </div>
            </div>
            <div class="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-xs text-gray-300 leading-relaxed text-left">
                ${item.description || 'Tăng cường khả năng chống chịu và giảm thiểu thương tổn nhận vào trong giao tranh.'}
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// 4. MODAL CHI TIẾT ĐẶC VỤ & KỸ NĂNG
// ==========================================
window.openAgentModal = function(uuid) {
    const agent = allAgents.find(a => a.uuid === uuid);
    if (!agent) return;

    document.getElementById('agent-modal-img').src = agent.displayIcon;
    document.getElementById('agent-modal-name').textContent = agent.displayName;
    document.getElementById('agent-modal-role').textContent = agent.role ? agent.role.displayName : 'Chiến Binh';
    document.getElementById('agent-modal-desc').textContent = agent.description;

    const abilitiesContainer = document.getElementById('agent-modal-abilities');
    abilitiesContainer.innerHTML = '';

    const slotNames = { "Ability1": "Phím Q", "Ability2": "Phím C", "Grenade": "Phím E (Đặc trưng)", "Ultimate": "Phím X (Chiêu cuối)" };

    agent.abilities.forEach(ab => {
        if (!ab.displayIcon) return;
        const box = document.createElement('div');
        box.className = "bg-gray-800/50 border border-gray-700 p-3 rounded-xl flex gap-3 items-start";
        box.innerHTML = `
            <img src="${ab.displayIcon}" class="w-10 h-10 object-contain p-1 bg-black/40 rounded border border-gray-700 mt-1">
            <div class="flex-1">
                <div class="flex justify-between items-center">
                    <h4 class="text-xs font-bold text-white uppercase">${ab.displayName}</h4>
                    <span class="text-[10px] bg-red-600/30 text-red-300 px-2 py-0.5 rounded font-bold">${slotNames[ab.slot] || ab.slot}</span>
                </div>
                <p class="text-[11px] text-gray-300 mt-1 leading-normal">${ab.description}</p>
            </div>
        `;
        abilitiesContainer.appendChild(box);
    });

    document.getElementById('agent-modal').classList.remove('hidden');
};
window.closeAgentModal = function() { document.getElementById('agent-modal').classList.add('hidden'); };

// ==========================================
// 5. CÁC HÀM SÚNG, SO SÁNH & CHATBOT AI
// ==========================================
window.filterWeapons = function() {
    const input = document.getElementById('search-input');
    const query = input ? input.value.toLowerCase() : '';
    let filtered = allWeapons.filter(gun => gun.displayName.toLowerCase().includes(query));
    if (currentCategory !== 'ALL') {
        filtered = filtered.filter(gun => {
            const cat = gun.shopData ? (gun.shopData.categoryText || gun.shopData.category) : '';
            return cat.toLowerCase().includes(currentCategory.toLowerCase());
        });
    }
    renderWeapons(filtered);
};

// Sửa lại hàm setCategory không phụ thuộc vào biến 'event'
window.setCategory = function(cat) {
    currentCategory = cat;
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-red-600', 'text-white');
        btn.classList.add('bg-gray-800', 'text-gray-300');
        if (btn.getAttribute('onclick')?.includes(`'${cat}'`)) {
            btn.classList.add('active', 'bg-red-600', 'text-white');
            btn.classList.remove('bg-gray-800', 'text-gray-300');
        }
    });
    filterWeapons();
};

window.toggleCompare = function(uuid) {
    if (compareList.includes(uuid)) {
        compareList = compareList.filter(id => id !== uuid);
    } else {
        if (compareList.length >= 2) { alert("Chỉ so sánh tối đa 2 súng!"); return; }
        compareList.push(uuid);
    }
    const bar = document.getElementById('compare-bar');
    const btn = document.getElementById('btn-do-compare');
    const count = document.getElementById('compare-count');
    if (count) count.textContent = compareList.length;
    
    if (bar) {
        if (compareList.length > 0) {
            bar.classList.remove('hidden');
            if (btn) btn.classList.toggle('hidden', compareList.length !== 2);
        } else { 
            bar.classList.add('hidden'); 
        }
    }
    filterWeapons();
};

window.clearCompare = function() { 
    compareList = []; 
    document.getElementById('compare-bar')?.classList.add('hidden'); 
    filterWeapons(); 
};

window.openCompareModal = function() {
    const gun1 = allWeapons.find(g => g.uuid === compareList[0]);
    const gun2 = allWeapons.find(g => g.uuid === compareList[1]);
    const content = document.getElementById('compare-content');
    if (!content || !gun1 || !gun2) return;

    content.innerHTML = [gun1, gun2].map(gun => {
        const stats = gun.weaponStats;
        const head = stats?.damageRanges?.[0]?.headDamage || 0;
        return `
            <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 class="text-xl font-bold text-red-500 uppercase mb-4">${gun.displayName}</h3>
                <img src="${gun.displayIcon}" class="h-16 object-contain mx-auto mb-4">
                <div class="space-y-2 text-xs text-left">
                    <div class="flex justify-between"><span class="text-gray-400">Sát thương Đầu:</span> <span class="font-bold text-white">${Math.round(head)}</span></div>
                    <div class="flex justify-between"><span class="text-gray-400">Tốc độ bắn:</span> <span class="font-bold text-white">${stats?.fireRate || 0} v/s</span></div>
                    <div class="flex justify-between"><span class="text-gray-400">Giá:</span> <span class="font-bold text-yellow-400">${gun.shopData ? gun.shopData.cost : 0} ¢</span></div>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('compare-modal')?.classList.remove('hidden');
};
window.closeCompareModal = function() { document.getElementById('compare-modal')?.classList.add('hidden'); };

window.openModal = function(uuid) {
    const gun = allWeapons.find(g => g.uuid === uuid);
    if (!gun) return;
    document.getElementById('modal-name').textContent = gun.displayName;
    document.getElementById('modal-img').src = gun.displayIcon;
    const damage = gun.weaponStats?.damageRanges?.[0];
    document.getElementById('modal-head').textContent = damage ? Math.round(damage.headDamage) : '-';
    document.getElementById('modal-body').textContent = damage ? Math.round(damage.bodyDamage) : '-';
    document.getElementById('modal-leg').textContent = damage ? Math.round(damage.legDamage) : '-';
    document.getElementById('detail-modal')?.classList.remove('hidden');
};
window.closeModal = function() { document.getElementById('detail-modal')?.classList.add('hidden'); };

// CHATBOT AI
const GEMINI_API_KEY = "AQ.Ab8RN6ICvFbhGFevyWGeMRz8-2_0ZttwIvrFs54GqpOtHUjz-Q";

window.toggleChat = function() { document.getElementById('chat-window')?.classList.toggle('hidden'); };
window.handleChatEnter = function(e) { if (e.key === 'Enter') sendChatMessage(); };

window.sendChatMessage = async function() {
    const input = document.getElementById('chat-input');
    const msg = input ? input.value.trim() : '';
    if (!msg) return;
    appendMsg(msg, 'user');
    input.value = '';
    const loadId = appendMsg("Đang suy nghĩ...", 'ai', true);

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Tư vấn ngắn gọn dưới 20 từ cho game thủ Valorant: ${msg}` }] 
                }],
                // Thêm cấu hình tối ưu tốc độ tại đây:
                generationConfig: {
                    maxOutputTokens: 70, // Giới hạn phản hồi ngắn để nhận lời thoại cực nhanh
                    temperature: 0.5     // Giảm độ ngẫu nhiên giúp phản hồi ổn định, ít độ trễ
                }
            })
        });
        
        const data = await res.json();
        document.getElementById(loadId)?.remove();

        if (data.error) {
            appendMsg(`Lỗi từ Google: ${data.error.message}`, 'ai');
            return;
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận được phản hồi từ AI.";
        appendMsg(text, 'ai');
    } catch (err) {
        document.getElementById(loadId)?.remove();
        appendMsg("Lỗi kết nối mạng đến máy chủ AI!", 'ai');
    }
};

function appendMsg(text, sender, isLoad = false) {
    const box = document.getElementById('chat-messages');
    if (!box) return null;
    const d = document.createElement('div');
    const id = 'm-' + Date.now();
    d.id = id;
    d.className = sender === 'user' 
        ? "bg-red-600 text-white p-2.5 rounded-lg rounded-tr-none self-end w-11/12 text-right"
        : `bg-gray-800 text-white p-2.5 rounded-lg rounded-tl-none self-start w-11/12 ${isLoad ? 'animate-pulse text-gray-400' : ''}`;
    d.textContent = text;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return id;
}

// Khởi chạy nạp toàn bộ dữ liệu
loadAllValorantData();