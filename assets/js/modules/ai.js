// File: assets/js/modules/ai.js

// System Prompt sesuai request Anda
const SYSTEM_PROMPT = `Kamu adalah Ayaka-Sync, asisten AI resmi dari Ayaka Store. Tugas kamu adalah membantu user dan buyers dengan ramah, cepat, dan gaul tapi tetap sopan. Cara ngomong kamu: - Panggil user dengan sebutan "Kak" - Pakai bahasa Indonesia yang santai, gak kaku, kayak temen ngobrol - Boleh pakai emoji secukupnya, jangan berlebihan - Jangan pernah jawab dengan bahasa robot / kaku. Tugas kamu: 1. Jawab pertanyaan tentang produk di Ayaka Store (harga, stok, cara beli, cara bayar) 2. Bantu buyer yang bingung cara checkout / pembayaran via Tripay / QRIS 3. Bantu tracking pesanan kalau buyer nanya "pesanan saya mana?" 4. Jawab pertanyaan umum seputar Ayaka Store 5. Kalau buyer mau komplain, tetap tenang, minta maaf, dan arahkan ke admin. Aturan penting: - Kalau kamu tidak tahu jawaban / stok / harga pastinya, JANGAN NGARANG. Jawab: "Wah untuk itu biar Ayaka cek dulu ke admin ya Kak, bentar ya..." - Jangan pernah memberikan nomor admin / link palsu kalau tidak diminta - Jangan pernah membahas topik 18+, judi, atau hal ilegal - Selalu akhiri dengan tawaran bantuan, contoh: "Ada lagi yang bisa Ayaka bantu, Kak?"`;

// Buat Session ID unik per user agar AI ingat konteks percakapan
function getSessionId() {
    let session = localStorage.getItem('ayaka_ai_session');
    if (!session) {
        session = 'ayaka-' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('ayaka_ai_session', session);
    }
    return session;
}

export async function sendAiMessage(event) {
    if (event) event.preventDefault(); // Mencegah form reload halaman

    const inputEl = document.getElementById('ai-input');
    const btnEl = document.getElementById('btn-send-ai');
    const chatBox = document.getElementById('ai-chat-box');
    const message = inputEl.value.trim();

    if (!message) return;

    // 1. Tampilkan pesan User di layar
    appendMessage(message, 'user');
    inputEl.value = '';
    inputEl.disabled = true;
    btnEl.disabled = true;

    // 2. Tampilkan Loading AI
    const loadingId = 'ai-loading-' + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" class="flex items-start gap-2 max-w-[85%]">
            <div class="w-8 h-8 bg-purple-500 border-2 border-neoBlack rounded-lg flex items-center justify-center text-white shrink-0">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="bg-white border-2 border-neoBlack p-3 rounded-xl rounded-tl-none shadow-neo-sm text-sm font-medium">
                <i class="fa-solid fa-ellipsis fa-fade text-purple-600"></i> Ayaka sedang mengetik...
            </div>
        </div>
    `;
    scrollToBottom();

    try {
        // 3. Siapkan Request ke API IkyyXD
        const sessionId = getSessionId();
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAyaka-Sync:`;
        const encodedPrompt = encodeURIComponent(fullPrompt);
        
        // Endpoint API sesuai kode yang Anda berikan
        const apiUrl = `https://api.ikyyxd.my.id/ai/gemini?text=${encodedPrompt}&sessionsId=${sessionId}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Hapus loading
        document.getElementById(loadingId)?.remove();

        if (data.status && data.result) {
            // 4. Tampilkan jawaban AI
            appendMessage(data.result, 'ai');
        } else {
            appendMessage("Waduh, maaf Kak sepertinya server Ayaka sedang sibuk. Coba lagi sebentar lagi ya.", 'ai');
        }

    } catch (error) {
        console.error("AI Error:", error);
        document.getElementById(loadingId)?.remove();
        appendMessage("Koneksi ke Ayaka AI terputus. Pastikan internet Kakak lancar ya.", 'ai');
    } finally {
        inputEl.disabled = false;
        btnEl.disabled = false;
        inputEl.focus();
    }
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById('ai-chat-box');
    const isUser = sender === 'user';
    
    // Format teks: ubah enter jadi <br> agar rapi
    const formattedText = text.replace(/\n/g, '<br>');

    const html = `
        <div class="flex items-start gap-2 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}">
            <div class="w-8 h-8 ${isUser ? 'bg-aqua' : 'bg-purple-500'} border-2 border-neoBlack rounded-lg flex items-center justify-center text-neoBlack shrink-0 shadow-neo-sm">
                <i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="${isUser ? 'bg-lightCyan rounded-tr-none' : 'bg-white rounded-tl-none'} border-2 border-neoBlack p-3 rounded-xl shadow-neo-sm text-sm font-medium">
                ${formattedText}
            </div>
        </div>
    `;
    
    chatBox.innerHTML += html;
    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = document.getElementById('ai-chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}