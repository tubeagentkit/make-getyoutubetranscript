import { Make } from '@makehq/sdk';
const make = new Make(process.env.MAKE_API_TOKEN, 'eu1.make.com');
const APP = 'getyoutubetranscript-bj0mzn';
const parts = [];
parts.push(['base', await make.sdk.apps.getSection(APP, 1, 'base')]);
parts.push(['connection.api', await make.sdk.connections.getSection(APP, 'api')]);
parts.push(['connection.parameters', await make.sdk.connections.getSection(APP, 'parameters')]);
for (const m of ['getTranscript', 'searchVideos', 'listChannelVideos', 'makeApiCall'])
  for (const s of ['api', 'parameters', 'samples']) { try { parts.push([`${m}.${s}`, await make.sdk.modules.getSection(APP, 1, m, s)]); } catch {} }
const key = process.env.REVIEW_KEY;
let leaks = 0;
for (const [name, body] of parts) {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  const hit = text.includes(key) || /sk_live_[A-Za-z0-9]{8,}/.test(text);
  if (hit) leaks++;
  console.log(name.padEnd(28), hit ? 'CONTAINS A KEY' : 'clean', '| auth refs:', (text.match(/connection\.apiKey|parameters\.apiKey/g) || []).length);
}
console.log(leaks ? `LEAKS: ${leaks}` : 'No API key stored in any app section.');
