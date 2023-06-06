import fs from 'fs';
import speech2json from '../src';

(async () => {
    console.log('Start');
    console.log(
        await speech2json(fs.readFileSync('./data/test.wav'), {
            type: 'audio/wav',
            token: process.env.WIT_ACCESS_TOKEN,
        }),
    );
})();
