import { JSEncrypt } from 'jsencrypt';

export function publicKeyEncryption(publicKey: string, cardNumber: string): string | false {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(cardNumber);
}
