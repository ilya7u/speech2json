# speech2json

This is a Speech Recognization library used [wit.ai api](https://wit.ai/docs/http/20230215/#post__speech_link).

## Install

Using NPM:

```
$ npm install speech2json
```

Using YARN:

```
$ yarn add speech2json
```

## Usage

Autoload .env file to process.env.

Try get Wit Access Token from environment variable WIT_ACCESS_TOKEN by default.

```ts
import speech2json from 'speech2json';
import fs from 'fs';

console.log(await speech2json(fs.readFileSync('./data/test.wav'), { type: 'audio/wav', token: process.env.WIT_ACCESS_TOKEN }));

console.log(await speech2json('https://example.com/test.wav', { type: 'audio/wav' }));
```

## Wit Access Token

After creating your app at [wit.ai](https://wit.ai/), you can find your access token in the app's Settings tab.
