// Creates or updates the GetYouTubeTranscript custom app on Make from the files in src/.
// Usage: MAKE_API_TOKEN=... node deploy.mjs   (state is kept in .make-app.json)
import { Make } from '@makehq/sdk';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const make = new Make(process.env.MAKE_API_TOKEN, 'eu1.make.com');
const read = (f) => readFileSync(new URL(`./src/${f}`, import.meta.url), 'utf8');
const STATE = new URL('./.make-app.json', import.meta.url);
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 2));

const MODULES = [
  { name: 'getTranscript', typeId: 4, label: 'Get a Transcript', description: 'Gets the transcript of a YouTube video, optionally with timestamps.', sections: ['api', 'parameters', 'interface', 'samples'] },
  { name: 'searchVideos', typeId: 9, label: 'Search Videos', description: 'Searches YouTube for videos matching a query.', sections: ['api', 'parameters', 'interface'] },
  { name: 'listChannelVideos', typeId: 9, label: 'List Channel Videos', description: "Lists a YouTube channel's uploaded videos, newest first.", sections: ['api', 'parameters', 'interface'] },
  { name: 'makeApiCall', typeId: 12, label: 'Make an API Call', description: 'Performs an arbitrary authorized API call.', sections: ['api', 'parameters', 'interface'] },
];

if (!state.app) {
  const app = await make.sdk.apps.create({ name: 'getyoutubetranscript', label: 'GetYouTubeTranscript', description: 'YouTube transcripts with timestamps, YouTube search and channel videos in one request.', theme: '#d63031', language: 'en', countries: [], audience: 'global' });
  state.app = app.name; state.version = app.version ?? 1; save();
  console.log('created app', state.app, 'v' + state.version);
}
const { app, version } = state;
await make.sdk.apps.setSection(app, version, 'base', read('base.json'));
console.log('base set');

if (!state.connection) {
  const conn = await make.sdk.connections.create(app, { type: 'basic', label: 'GetYouTubeTranscript' });
  state.connection = conn.name; save();
  console.log('created connection', state.connection);
}
await make.sdk.connections.setSection(state.connection, 'parameters', read('connection.parameters.json'));
await make.sdk.connections.setSection(state.connection, 'api', read('connection.api.json'));
console.log('connection sections set');

state.modules = state.modules || {};
for (const m of MODULES) {
  if (!state.modules[m.name]) {
    await make.sdk.modules.create(app, version, { name: m.name, typeId: m.typeId, label: m.label, description: m.description, moduleInitMode: 'blank' });
    state.modules[m.name] = true; save();
  }
  await make.sdk.modules.update(app, version, m.name, { label: m.label, description: m.description, connection: state.connection });
  for (const s of m.sections) await make.sdk.modules.setSection(app, version, m.name, s, read(`modules/${m.name}.${s}.json`));
  console.log('module ready:', m.name);
}
await make.sdk.apps.setIcon(app, version, readFileSync(new URL('./src/icon.png', import.meta.url)));
await make.sdk.apps.setDocs(app, version, read('docs.md'));
console.log('icon + docs set. App:', app);
