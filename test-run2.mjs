const base = 'https://eu1.make.com/api/v2';
const H = { Authorization: `Token ${process.env.MAKE_API_TOKEN}`, 'Content-Type': 'application/json' };
const api = async (path, opts = {}) => { const r = await fetch(base + path, { ...opts, headers: H }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } if (!r.ok) throw new Error(`${r.status} ${path}: ${t.slice(0, 400)}`); return j; };
const APP = 'getyoutubetranscript-bj0mzn', teamId = 3046760, connId = 11566921;
const mod = (id, name, mapper) => ({ id, module: `app#${APP}:${name}`, version: 1, parameters: { __IMTCONN__: connId }, mapper, metadata: { designer: { x: id * 300, y: 0 } } });
const meta = { version: 1, scenario: { roundtrips: 1, maxErrors: 3, autoCommit: true, sequential: false, confidential: false, dataloss: false, dlq: false } };
const scenarios = [
  { name: 'GetYouTubeTranscript universal module test', flow: [mod(1, 'makeApiCall', { url: '/credits', method: 'GET' })] },
  { name: 'GetYouTubeTranscript error handling test', flow: [mod(1, 'getTranscript', { video: 'notavideo!!', language: 'en', timestamps: false })] },
];
for (const s of scenarios) {
  const sc = await api('/scenarios?confirmed=true', { method: 'POST', body: JSON.stringify({ teamId, blueprint: JSON.stringify({ name: s.name, flow: s.flow, metadata: meta }), scheduling: JSON.stringify({ type: 'on-demand' }) }) });
  const id = sc.scenario.id;
  await api(`/scenarios/${id}/start`, { method: 'POST' });
  let run;
  try { run = await api(`/scenarios/${id}/run`, { method: 'POST', body: JSON.stringify({ responsive: true }) }); } catch (e) { run = { error: e.message.slice(0, 200) }; }
  await api(`/scenarios/${id}/stop`, { method: 'POST' }).catch(() => {});
  const logs = await api(`/scenarios/${id}/logs?pg[limit]=1`);
  const l = (logs.scenarioLogs || [])[0] || {};
  console.log(s.name, '| scenario', id, '| run', JSON.stringify(run).slice(0, 120), '| log status', l.status, '| error', JSON.stringify(l.error || '').slice(0, 160));
}
