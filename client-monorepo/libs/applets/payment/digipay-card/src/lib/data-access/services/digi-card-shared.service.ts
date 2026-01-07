import { inject, signal } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import JSEncrypt from 'jsencrypt';
import { of } from 'rxjs';

export class DigiCardSharedService {
  private textEncoder = new TextEncoder();
  private apiService = inject(ApiService);

  publicKey = signal<string | null>(null);
  private readonly modulusB64 =
    'yFUQq8gkBvrAqkLpdZEHxAGN8j+jyV0/vNO9sGJutnkAc5oCsj6JhG6rz+QEYkjyT1wd25D4LpCt2MFZ+LMFNwsK//MtqZSY2QhXkSo/NdzvWp4Rad8KUQ99UvtVz+ifThp/F05VyrIEuLZlkj26f212As47fjCjfo8zOCyXlcrThUnC7T2ldM1da7+pCgD81cIsu7IQBOc51c/13oTfK0tB4ZKNIc5WMm+NtRNtftCBOLr8VmCSSDg8X2gU2bQ4y75oxguDXW7TQkU8ndppsClpz02W/+LiMapJA4V3VqM0fan55AREHyMUL0ceDomDgKjjNkuVl4/499E1BOMEFQ==';

  private readonly exponentB64 = 'AQAB';

  // Base64 → Base64URL (for JWK n,e)
  private b64ToB64Url(b64: string): string {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  private async getPublicKeyTemp(): Promise<CryptoKey> {
    const jwk: JsonWebKey = {
      kty: 'RSA',
      n: this.b64ToB64Url(this.modulusB64),
      e: this.b64ToB64Url(this.exponentB64),
      alg: 'RSA-OAEP',
      ext: true,
      key_ops: ['encrypt'],
    };

    return crypto.subtle.importKey(
      'jwk',
      jwk,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' }, // matches Java OAEP SHA-1
      },
      false,
      ['encrypt'],
    );
  }

  // ArrayBuffer → Base64 (same style as Java Base64 encoder)
  private arrayBufferToBase64(buf: ArrayBuffer): string {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 1000) as unknown as number[]);
    }
    return btoa(binary);
  }

  private extractBetween(text: string, startTag: string, endTag: string): string {
    const start = text.indexOf(startTag);
    if (start === -1) return '';
    const end = text.indexOf(endTag, start + startTag.length);
    if (end === -1) return '';
    return text.substring(start + startTag.length, end);
  }

  private async importPublicKeyFromXml(xml: string): Promise<CryptoKey> {
    const modulusB64 = this.extractBetween(xml, '<Modulus>', '</Modulus>');
    const exponentB64 = this.extractBetween(xml, '<Exponent>', '</Exponent>');

    const jwk: JsonWebKey = {
      kty: 'RSA',
      n: this.b64ToB64Url(modulusB64),
      e: this.b64ToB64Url(exponentB64),
      alg: 'RSA-OAEP',
      ext: true,
      key_ops: ['encrypt'],
    };

    return crypto.subtle.importKey(
      'jwk',
      jwk,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' },
      },
      false,
      ['encrypt'],
    );
  }

  async encryptData(data: string, publicKeyXml?: string): Promise<string> {
    let publicKey: CryptoKey;
    if (publicKeyXml) {
      publicKey = await this.importPublicKeyFromXml(publicKeyXml);
    } else {
      publicKey = await this.getPublicKeyTemp();
    }

    const encoded = this.textEncoder.encode(data);
    const ciphertext = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encoded);

    return this.arrayBufferToBase64(ciphertext);
  }

  getPublicKey(vaultName: string) {
    // const request = new RequestBuilder(RequestTypeEnum.GET_TEXT, `certs/${vaultName}`);
    // return this.apiService.call<string>(request);
    return of(
      '<RSAKeyValue><Modulus>yFUQq8gkBvrAqkLpdZEHxAGN8j+jyV0/vNO9sGJutnkAc5oCsj6JhG6rz+QEYkjyT1wd25D4LpCt2MFZ+LMFNwsK//MtqZSY2QhXkSo/NdzvWp4Rad8KUQ99UvtVz+ifThp/F05VyrIEuLZlkj26f212As47fjCjfo8zOCyXlcrThUnC7T2ldM1da7+pCgD81cIsu7IQBOc51c/13oTfK0tB4ZKNIc5WMm+NtRNtftCBOLr8VmCSSDg8X2gU2bQ4y75oxguDXW7TQkU8ndppsClpz02W/+LiMapJA4V3VqM0fan55AREHyMUL0ceDomDgKjjNkuVl4/499E1BOMEFQ==</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>',
    );
  }

  encryptStringObject<T extends object>(entity: T, publicKey: string): { [K in keyof T]: string } {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);

    const result = {} as { [K in keyof T]: string };

    (Object.keys(entity) as (keyof T)[]).forEach((key) => {
      const value = entity[key];

      const encrypted = encrypt.encrypt(value as string);
      if (!encrypted) {
        throw new Error(`Encryption failed for field "${String(key)}"`);
      }

      result[key] = encrypted;
    });

    return result;
  }
}
