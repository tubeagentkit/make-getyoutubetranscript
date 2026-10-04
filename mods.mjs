import { Make } from '@makehq/sdk';
const make = new Make(process.env.MAKE_API_TOKEN, 'eu1.make.com');
const mods = await make.sdk.modules.list('getyoutubetranscript-bj0mzn', 1);
for (const m of mods) console.log(m.name, '| public:', m.public, '| approved:', m.approved, '| typeId:', m.typeId);
