// Loader HTML partials & sections via fetch, lalu replace wrapper-nya.
export async function loadIncludes() {
    const nodes = document.querySelectorAll('[data-include]');
    await Promise.all([...nodes].map(async (el) => {
        const path = el.dataset.include;
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const html = await res.text();
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const parent = el.parentNode;
            while (temp.firstChild) parent.insertBefore(temp.firstChild, el);
            parent.removeChild(el);
        } catch (e) {
            console.error(`Failed to include "${path}":`, e);
        }
    }));
}