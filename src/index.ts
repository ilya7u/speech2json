import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import { Stream } from 'stream';

// https://wit.ai/docs/http/20230215/#post__speech_link

const DEFAULT_CONTENT_TYPE = 'audio/wav';

dotenv.config();

export type S2JContentType = 'audio/wav' | 'audio/mpeg3' | 'audio/ogg' | 'audio/ulaw' | 'audio/raw';
export type S2JContentEncoding =
    | 'signed-integer'
    | 'unsigned-integer'
    | 'floating-point'
    | 'mu-law'
    | 'a-law'
    | 'ima-adpcm'
    | 'ms-adpcm'
    | 'gsm-full-rate';
export type S2JContentBits = 8 | 16 | 32;
export type S2JContentEndian = 'big' | 'little';

export interface S2JParams {
    type?: S2JContentType; // default 'audio/wav'
    encoding?: S2JContentEncoding;
    bits?: S2JContentBits;
    rate?: number; // an integer value like 8000 or 8k
    endian?: S2JContentEndian;

    token?: string;
}

export const speech2json = async (url: string | Stream | Buffer, params: S2JParams = {}) => {
    params.type ??= DEFAULT_CONTENT_TYPE;
    params.token ??= process.env.WIT_ACCESS_TOKEN;

    const contentType = `${params.type}${params.encoding ? ';' + params.encoding : ''}${
        params.bits ? ';' + params.bits : ''
    }${params.rate ? ';' + params.rate : ''}${params.endian ? ';' + params.endian : ''}`;
    let stream = url;
    if (typeof url === 'string') {
        if (url.startsWith('http')) {
            const response = await axios.get(url, {
                responseType: 'stream',
            });
            stream = response.data;
        } else {
            stream = fs.createReadStream(url);
        }
    }
    const { data } = await axios({
        method: 'POST',
        url: 'https://api.wit.ai/speech',
        headers: {
            Authorization: 'Bearer ' + params.token,
            'Content-Type': contentType,
        },
        data: stream,
    });
    return JSON.parse('[' + data.split('\r\n').join(',') + ']');
};

export default speech2json;
