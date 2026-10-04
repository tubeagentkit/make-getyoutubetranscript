import { Make } from '@makehq/sdk';
const make = new Make(process.env.MAKE_API_TOKEN, 'eu1.make.com');
const APP = 'getyoutubetranscript-bj0mzn';
for (const m of ['getTranscript', 'searchVideos', 'listChannelVideos', 'makeApiCall']) { await make.sdk.modules.makePublic(APP, 1, m); }
for (const m of await make.sdk.modules.list(APP, 1)) console.log(m.name, '| public:', m.public);
