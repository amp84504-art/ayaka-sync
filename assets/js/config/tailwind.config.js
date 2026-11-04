// Konfigurasi Tailwind Play CDN — di-load SETELAH CDN Tailwind
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                aqua: '#00F0FF',
                lightCyan: '#E0F7FA',
                waterBlue: 'rgba(0, 210, 255, 0.15)',
                neoBlack: '#121212',
                neoBg: '#F4F9FB',
                neoOrange: '#FF5722',
            },
            boxShadow: {
                'neo': '4px 4px 0px #121212',
                'neo-lg': '6px 6px 0px #121212',
                'neo-sm': '2px 2px 0px #121212',
                'neo-float': '0px 10px 25px -5px rgba(0, 0, 0, 0.3), 4px 4px 0px #121212'
            }
        }
    }
};