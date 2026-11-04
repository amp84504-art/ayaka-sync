# AYAKA DIGITAL STORE

Refactor dari single-file `index.html` menjadi struktur folder modular.

## 📂 Struktur

- `index.html` → shell utama
- `partials/` → sidebar, header mobile, drawer, bottom-nav
- `sections/` → setiap tab dipisah (home, smm, dll)
- `assets/css/` → custom CSS
- `assets/js/config/` → tailwind + app config
- `assets/js/data/` → state & fallback data
- `assets/js/utils/` → helper (format, alert, dom, balance)
- `assets/js/components/` → include loader, router, banner
- `assets/js/services/` → wrapper API (IndoSMM, ByFastt)
- `assets/js/modules/` → logika fitur (smm, topup, transactions, auth)
- `assets/js/main.js` → entry point (bootstrap)

## ▶️ Cara Menjalankan

Karena menggunakan `fetch()` untuk include partials & ES Module, **wajib di-serve via HTTP** (bukan `file://`).

Pilih salah satu:

```bash
# Python
python -m http.server 5500

# Node.js
npx serve .

# Atau pakai Live Server di VSCode