const base = 'https://eu1.make.com/api/v2';
const H = { Authorization: `Token ${process.env.MAKE_API_TOKEN}`, 'Content-Type': 'application/json' };
const api = async (path, opts = {}) => { const r = await fetch(base + path, { ...opts, headers: H }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } if (!r.ok) throw new Error(`${r.status} ${path}: ${t.slice(0, 300)}`); return j; };
const id = process.argv[2];
await api(`/scenarios/${id}/start`, { method: 'POST' });
const run = await api(`/scenarios/${id}/run`, { method: 'POST', body: JSON.stringify({ responsive: true }) });
await api(`/scenarios/${id}/stop`, { method: 'POST' }).catch(() => {});
console.log('scenario', id, 'run:', JSON.stringify(run).slice(0, 200));
