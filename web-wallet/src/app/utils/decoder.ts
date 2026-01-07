import { Base64 } from 'js-base64';

export function Decoder(data: string):any {
  data = decodeURIComponent(data);
  return JSON.parse(Base64.decode(data));
}
