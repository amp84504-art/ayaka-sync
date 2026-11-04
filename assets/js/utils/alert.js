export function showAlert(msg, type = 'info') {
    const box = document.getElementById('alert-box');
    const msgEl = document.getElementById('alert-msg');
    if (!box || !msgEl) return;

    msgEl.innerText = msg;
    box.className = "mb-6 p-4 rounded-xl border-2 border-neoBlack shadow-neo font-bold flex justify-between items-center ";
    if (type === 'success') box.className += "bg-green-200 text-green-900";
    else if (type === 'error') box.className += "bg-red-200 text-red-900";
    else box.className += "bg-blue-200 text-blue-900";

    box.classList.remove('hidden');
    setTimeout(() => closeAlert(), 5000);
}

export function closeAlert() {
    const box = document.getElementById('alert-box');
    if (box) box.classList.add('hidden');
}