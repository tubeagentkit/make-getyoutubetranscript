// Review test scenarios (Make QA item 2): one per module, pagination beyond page 1, timestamps on/off, an error case.
const base = 'https://eu1.make.com/api/v2';
const H = { Authorization: `Token ${process.env.MAKE_API_TOKEN}`, 'Content-Type': 'application/json' };
const api = async (path, opts = {}) => { const r = await fetch(base + path, { ...opts, headers: H }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } if (!r.ok) throw new Error(`${r.status} ${path}: ${t.slice(0, 300)}`); return j; };
const APP = 'getyoutubetranscript-bj0mzn', teamId = 3046760, connId = 11566921;
const mod = (id, name, mapper) => ({ id, module: `app#${APP}:${name}`, version: 1, parameters: { __IMTCONN__: connId }, mapper, metadata: { designer: { x: id * 300, y: 0 } } });
const meta = { version: 1, scenario: { roundtrips: 1, maxErrors: 3, autoCommit: true, sequential: false, confidential: false, dataloss: false, dlq: false } };
const defs = [
  { name: 'Review: Get a transcript (timestamps on and off)', flow: [mod(1, 'getTranscript', { video: 'jNQXAC9IVRw', language: 'en', timestamps: true }), mod(2, 'getTranscript', { video: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', language: 'en', timestamps: false })] },
  { name: 'Review: Search videos (limit 60, two pages)', flow: [mod(1, 'searchVideos', { query: 'lofi beats', limit: 60 })] },
  { name: 'Review: List channel videos (limit 40, two pages)', flow: [mod(1, 'listChannelVideos', { channel: '@mkbhd', limit: 40 })] },
  { name: 'Review: Make an API call (/v1/credits with a custom header)', flow: [mod(1, 'makeApiCall', { url: '/v1/credits', method: 'GET', headers: [{ key: 'Accept', value: 'application/json' }], qs: [] })] },
];
const out = {};
for (const d of defs) {
  const sc = await api('/scenarios?confirmed=true', { method: 'POST', body: JSON.stringify({ teamId, blueprint: JSON.stringify({ name: d.name, flow: d.flow, metadata: meta }), scheduling: JSON.stringify({ type: 'on-demand' }) }) });
  const id = sc.scenario.id; out[d.name] = id;
  await api(`/scenarios/${id}/start`, { method: 'POST' });
  let run; try { run = await api(`/scenarios/${id}/run`, { method: 'POST', body: JSON.stringify({ responsive: true }) }); } catch (e) { run = { error: e.message.slice(0, 200) }; }
  await api(`/scenarios/${id}/stop`, { method: 'POST' }).catch(() => {});
  const logs = await api(`/scenarios/${id}/logs?pg[limit]=1`);
  const l = (logs.scenarioLogs || [])[0] || {};
  console.log(id, '|', d.name, '| status', run.status ?? run.error, '| operations', l.operations);
}
console.log(JSON.stringify(out));
