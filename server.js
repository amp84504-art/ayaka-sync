const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ==========================================
// KONFIGURASI NOKOS PUSAT
// ==========================================
const BASE_URL_NOKOS = process.env.NOKOS_BASE_URL;
const NOKOS_API_KEY = process.env.NOKOS_API_KEY;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callNokos(pathStr, init = {}) {
    if (!NOKOS_API_KEY) throw new Error("Isi NOKOS_API_KEY di .env");
    if (!BASE_URL_NOKOS) throw new Error("Isi NOKOS_BASE_URL di .env");
    
    const method = init.method ?? "GET";
    for (let attempt = 0; attempt < 3; attempt += 1) {
        const response = await fetch(`${BASE_URL_NOKOS}${pathStr}`, {
            ...init,
            method,
            redirect: "error",
            signal: AbortSignal.timeout(20000),
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${NOKOS_API_KEY}`,
                ...(init.body ? { "Content-Type": "application/json" } : {}),
                ...init.headers,
            },
        });
        
        if (response.ok) {
            const json = await response.json();
            return json.data;
        }
        
        if (method === "GET" && [429, 503].includes(response.status) && attempt < 2) {
            const retry = response.headers.get("Retry-After");
            const seconds = retry === null ? 5 * (attempt + 1)
                : /^\d+$/.test(retry) ? Number(retry)
                : Math.max(0, (Date.parse(retry) - Date.now()) / 1000);
            if (!Number.isFinite(seconds) || seconds > 60)
                throw new Error("Retry-After tidak valid/terlalu lama; lanjutkan nanti.");
            await wait(Math.max(1, seconds) * 1000);
            continue;
        }
        
        const payload = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${payload.error?.code ?? "unknown_error"}.`);
    }
}

// ==========================================
// SERVER HTTP & ENDPOINTS
// ==========================================
const MIME_TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // 1. ENDPOINT ENV CONFIG (DIPERBARUI UNTUK AIRPAY)
  if (req.url === '/api/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({
      byfasttUrl: process.env.BYFASTT_URL,
      byfasttToken: process.env.BYFASTT_TOKEN,
      indosmmBaseUrl: process.env.INDOSMM_BASE_URL,
      indosmmApiKey: process.env.INDOSMM_API_KEY,
      
      // TAMBAHAN UNTUK AIRPAY
      airpayUrl: process.env.AIRPAY_BASE_URL,
      airpayKey: process.env.AIRPAY_API_KEY
    }));
    return;
  }

  // 2. ENDPOINT BUAT PESANAN NOKOS
  if (req.url === '/api/nokos/order' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          await callNokos("/api/v1/wallet");
          
          const countries = await callNokos("/api/v1/services/whatsapp-id/countries?provider=provider_1");
          const country = countries.find((item) => item.country_code === "6");
          if (!country) throw new Error("Wilayah Indonesia tidak tersedia.");
          
          const offers = await callNokos(`/api/v1/services/whatsapp-id/offers?provider=provider_1&country_code=${encodeURIComponent(country.country_code)}`);
          const offer = offers.find((item) => item.stock > 0);
          if (!offer) throw new Error("Stok Nokos sedang kosong.");
          
          const orderKey = crypto.randomUUID();
          const orderBody = {
            service_id: "whatsapp-id", provider: "provider_1", country_code: country.country_code,
            provider_id: offer.provider_id, quoted_price: offer.price,
          };
          
          const order = await callNokos("/api/v1/orders", {
            method: "POST",
            headers: { "Idempotency-Key": orderKey },
            body: JSON.stringify(orderBody),
          });
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: order }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: err.message }));
        }
      });
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // 3. ENDPOINT CEK STATUS & OTP NOKOS
  if (req.url.startsWith('/api/nokos/status/') && req.method === 'GET') {
    try {
      const orderId = req.url.split('/').pop();
      const order = await callNokos(`/api/v1/orders/${encodeURIComponent(orderId)}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: order }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // SERVE FILE STATIS
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});