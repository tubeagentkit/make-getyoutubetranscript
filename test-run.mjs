// Creates a Make connection with the review key, builds a scenario chaining our modules, runs it, prints outputs.
import { Make } from '@makehq/sdk';
const make = new Make(process.env.MAKE_API_TOKEN, 'eu1.make.com');
const APP = 'getyoutubetranscript-bj0mzn';
const base = 'https://eu1.make.com/api/v2';
const H = { Authorization: `Token ${process.env.MAKE_API_TOKEN}`, 'Content-Type': 'application/json' };
const api = async (path, opts = {}) => { const r = await fetch(base + path, { ...opts, headers: H }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; } if (!r.ok) throw new Error(`${r.status} ${path}: ${t.slice(0, 300)}`); return j; };

const me = await api('/users/me');
const orgs = await api('/organizations');
const teams = await api(`/teams?organizationId=${orgs.organizations[0].id}`);
const teamId = teams.teams[0].id;
console.log('team', teamId);

let connId = Number(process.env.CONN_ID || 0);
if (!connId) {
  const conn = await api(`/connections?teamId=${teamId}`, { method: 'POST', body: JSON.stringify({ accountName: 'GetYouTubeTranscript review', accountType: 'app#' + APP, apiKey: process.env.GYT_KEY }) });
  connId = conn.connection.id;
}
console.log('connection', connId);
const test = await api(`/connections/${connId}/test`, { method: 'POST' });
console.log('connection test:', JSON.stringify(test).slice(0, 200));

const mod = (id, name, mapper, extra = {}) => ({ id, module: `app#${APP}:${name}`, version: 1, parameters: { __IMTCONN__: connId }, mapper, metadata: { designer: { x: id * 300, y: 0 } }, ...extra });
const blueprint = {
  name: 'GetYouTubeTranscript module test',
  flow: [
    mod(1, 'getTranscript', { video: 'jNQXAC9IVRw', language: 'en', timestamps: true }),
    mod(2, 'searchVideos', { query: 'lofi beats', limit: 3 }),
    mod(3, 'listChannelVideos', { channel: '@mkbhd', limit: 3 }),
  ],
  metadata: { version: 1, scenario: { roundtrips: 1, maxErrors: 3, autoCommit: true, sequential: false, confidential: false, dataloss: false, dlq: false } },
};
const sc = await api('/scenarios?confirmed=true', { method: 'POST', body: JSON.stringify({ teamId, blueprint: JSON.stringify(blueprint), scheduling: JSON.stringify({ type: 'on-demand' }) }) });
const scenarioId = sc.scenario.id;
console.log('scenario', scenarioId);
const run = await api(`/scenarios/${scenarioId}/run`, { method: 'POST', body: JSON.stringify({ responsive: true }) });
console.log('run:', JSON.stringify(run).slice(0, 400));
console.log(JSON.stringify({ teamId, connId, scenarioId }));
