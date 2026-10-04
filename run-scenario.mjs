const base = 'https://eu1.make.com/api/v2';
const H = { Authorization: `Token ${process.env.MAKE_API_TOKEN}`, 'Content-Type': 'application/json' };
const api = async (path, opts = {}) => { const r = await fetch(base + path, { ...opts, headers: H }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } if (!r.ok) throw new Error(`${r.status} ${path}: ${t.slice(0, 400)}`); return j; };
const id = process.argv[2];
await api(`/scenarios/${id}/start`, { method: 'POST' });
const run = await api(`/scenarios/${id}/run`, { method: 'POST', body: JSON.stringify({ responsive: true }) });
console.log('run:', JSON.stringify(run).slice(0, 300));
await api(`/scenarios/${id}/stop`, { method: 'POST' });
const exe = run.executionId;
if (exe) {
  const logs = await api(`/scenarios/${id}/logs?pg[limit]=5`);
  const l = (logs.scenarioLogs || [])[0];
  console.log('last log:', JSON.stringify(l ? { status: l.status, operations: l.operations, duration: l.duration, error: l.error } : logs).slice(0, 300));
}
