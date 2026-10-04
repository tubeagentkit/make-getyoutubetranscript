import { Make } from '@makehq/sdk';
const make = new Make(process.env.MAKE_API_TOKEN, 'eu1.make.com');
const APP = 'getyoutubetranscript-bj0mzn';
for (const m of ['listChannelVideos', 'makeApiCall']) {
  try { const r = await make.sdk.modules.makePublic(APP, 1, m); console.log(m, 'makePublic ->', JSON.stringify(r)); } catch (e) { console.log(m, 'ERROR', e.message, JSON.stringify(e.response?.data || e.body || '').slice(0, 300)); }
  await new Promise(r => setTimeout(r, 1500));
}
for (const m of await make.sdk.modules.list(APP, 1)) console.log(m.name, '| public:', m.public);
