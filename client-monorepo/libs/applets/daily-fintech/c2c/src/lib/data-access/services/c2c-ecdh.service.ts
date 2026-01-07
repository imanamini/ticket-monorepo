import { inject, Injectable } from '@angular/core';
import { SHUFFLE_MAPPER } from '../constants/shuffle-mapper';
import { bufferToHex, fromHexString, MessageService, shuffleArray } from '@client-monorepo/common/utilities';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class C2cEcdhService {
  messageService = inject(MessageService);
  /**
   * used to x509 format encoding
   * is standard defining the format of public key
   */
  private PUBLIC_KEY_HEADER = atob('MzA1OTMwMTMwNjA3MmE4NjQ4Y2UzZDAyMDEwNjA4MmE4NjQ4Y2UzZDAzMDEwNzAzNDIwMA==');
  /**
   * generated once and used everywhere
   */
  clientPairKey!: {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
  };

  serverTraceData: {
    publicKey: string;
    randomNumber: string;
  } = {
    publicKey: '',
    randomNumber: '',
  };

  private LENGTHS: number[] = [25, 35, 45, 50, 30];

  private MAX_RANDOM = 999;

  private EXTRACT_CHARS_INDEXES = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181];

  private INSERT_SALT_INDEXED = [3, 5, 9];

  private shuffleMapperIndex = 0;

  constructor() {}

  /**
   * called once to generate clientPairKey
   */
  private async generatePairKey() {
    this.clientPairKey = await window.crypto.subtle.generateKey(
      {
        name: atob('RUNESA=='),
        namedCurve: atob('UC0yNTY='),
      },
      true, // no need to make client's private key exportable
      ['deriveKey', 'deriveBits'],
    );
    return this.clientPairKey;
  }

  /**
   * generate client public key clientPairKey and
   * used in the generateClientTraceCode function
   * clientPublicKeyX509 returns an upperCase string with a length of 182
   * upperCase is contract
   */
  private async generatePublicKey(): Promise<string> {
    const pairKey = await this.generatePairKey();
    const clientPublicKey = await window.crypto.subtle.exportKey('raw', pairKey.publicKey);
    const clientPublicKeyHex = bufferToHex(clientPublicKey);
    const clientPublicKeyX509 = this.PUBLIC_KEY_HEADER + clientPublicKeyHex;
    return clientPublicKeyX509.toUpperCase();
  }

  /**
   * generate sharedSecret of clientPrivateKey and
   * serverPublicKey
   */
  private async generateSharedSecret(clientPrivateKey: any, pureServerPublicKey: any): Promise<string> {
    let serverPublicKey = pureServerPublicKey;
    if (serverPublicKey.length === 182) {
      const decodeX509 = serverPublicKey.substring(this.PUBLIC_KEY_HEADER.length);
      serverPublicKey = fromHexString(decodeX509);
    } else if (serverPublicKey.length === 130) {
      serverPublicKey = fromHexString(pureServerPublicKey);
    }
    const serverPublicKeyImported = await window.crypto.subtle.importKey(
      'raw',
      serverPublicKey, // already converted to ArrayBuffer format
      {
        name: atob('RUNESA=='),
        namedCurve: atob('UC0yNTY='),
      },
      true,
      [],
    );

    const sharedSecret = await window.crypto.subtle.deriveBits(
      {
        name: atob('RUNESA=='),
        namedCurve: atob('UC0yNTY='),
        public: serverPublicKeyImported,
      } as EcdhKeyDeriveParams,
      clientPrivateKey,
      256,
    );
    //  uppercase is contract
    return bufferToHex(sharedSecret).toUpperCase();
  }

  /**
   * generate traceCode based on contract contains:
   * 1) A 5-digit number including the numbers 0 to 4
   * 2) map them based on selected-algorithm (map-index === index 0 of numbers)
   * 3) A multi-digit random number between 0 and n = 999
   * 4) minus random number ( = 999 - random number )
   * 5) A 182-char public key with specific algorithm
   * 6) insert minus random number digits in 3, 5 and 9 indexes
   * contractTraceCode returns a string with length of: first 3-char part of mapped numbers + 185-char of publicKey and inserted minus random number + second 3-char part of mapped numbers
   */
  private async generateClientTraceCode(): Promise<string> {
    const shuffledOrderArray = this.generateShuffleKeyOrder(5);
    this.shuffleMapperIndex = shuffledOrderArray[0];
    const randomMultiDigitString = this.generateMultiDigitRandomNumber(this.MAX_RANDOM);
    const minusRandomMultiDigitString = this.getMinusMultiDigitRandomNumberAsString(this.MAX_RANDOM, randomMultiDigitString);
    const clientPublicKey = await this.generatePublicKey();
    const contractKey = this.insertCharsAtIndexes(clientPublicKey, this.INSERT_SALT_INDEXED, minusRandomMultiDigitString);
    const shuffledContractCode = this.generateShuffledContractCode(shuffledOrderArray, contractKey);
    const mappedShuffleArray = this.shuffleOrderMapper(shuffledOrderArray);
    // add index of selected mapper to the beginning of mappedShuffle
    mappedShuffleArray.unshift(this.shuffleMapperIndex);
    const [firstSlice, secondSlice] = this.generateSlicesOfMappedShuffleArray(mappedShuffleArray, 3, 3);
    return firstSlice + shuffledContractCode + secondSlice;
  }

  public observeGenerateClientTraceCode(): Observable<string> {
    return from(this.generateClientTraceCode());
  }

  /**
   * generate random array with partsNumber length
   * used to shuffle clientPublicKey based on items
   */
  private generateShuffleKeyOrder(partsNumber: number): number[] {
    return shuffleArray(Array.from(Array(partsNumber).keys()));
  }

  /**
   * generate random number between 0 and n=999
   * return string because we need exact n digit
   * to concat "random number" & "clientPublicKey hex format"
   */
  private generateMultiDigitRandomNumber(digitNumber: number): string {
    const randomDigit = Math.floor(Math.random() * (digitNumber + 1));
    const randomDigitString = randomDigit.toString();
    const digitNumberString = digitNumber.toString();
    return randomDigitString.padStart(digitNumberString.length, '0');
  }

  private getMinusMultiDigitRandomNumberAsString(digitNumber: number, randomNumber: string): string {
    const minusNumberAsString = `${Number(digitNumber) - Number(randomNumber)}`;
    return minusNumberAsString.padStart(digitNumber.toString().length, '0');
  }

  private insertCharsAtIndexes(baseString: string, indexes: number[], chars: string) {
    const splitChars = chars.split('');
    const result = baseString.split('');
    for (let i = 0; i < indexes.length; i++) {
      const insertIndex = indexes[i];
      result.splice(insertIndex, 0, splitChars[i]);
    }
    return result.join('');
  }

  private extractRandomNumberAndPublicKey(baseString: string, indexes: number[]) {
    // Sort indexes in descending order to avoid index shifting issues
    const sortedIndexes = [...indexes].sort((a, b) => b - a);

    const chars = baseString.split('');
    const extractedChars: string[] = [];

    // Extract characters at specified indexes (in reverse order)
    for (const idx of sortedIndexes) {
      extractedChars.push(chars[idx]);
      chars.splice(idx, 1);
    }

    // Reverse to maintain original order from the indexes array
    extractedChars.reverse();

    return {
      publicKey: chars.join(''),
      randomNumber: extractedChars.join(''),
    };
  }

  private generateShuffledContractCode(orderArray: number[], customValue: string): string {
    const bucksCustomValue = this.generateBucksOfString(customValue, this.LENGTHS);
    const sortedArray: Array<string> = [];
    orderArray.map((item, index) => (sortedArray[item] = bucksCustomValue[index]));
    return sortedArray.join('');
  }

  /**
   * generate equal parts of string to the desired length
   * return string because we need exact two digit
   * to concat number & clientPublicKey hex format
   */
  private generateBucksOfString(customValue: string, lengths: number[]): string[] {
    let startIndex = 0;
    return lengths.reduce((resultArray: Array<string>, length) => {
      const item = customValue.substr(startIndex, length);
      startIndex += length;
      return resultArray.concat(item);
    }, []);
  }

  private shuffleOrderMapper(pureArray: number[]): Array<number | string> {
    const selectedShuffleMapper = SHUFFLE_MAPPER[this.shuffleMapperIndex];
    const mappedOrder: Array<number | string> = [];
    pureArray.map((item, index) => (mappedOrder[index] = selectedShuffleMapper[item]));
    return mappedOrder;
  }

  /**
   * generate slices of mappedArray's items based of length of each slice
   * return an array of strings that each item has length of lengthOfSlices in order
   */
  private generateSlicesOfMappedShuffleArray(mappedArray: Array<number | string>, ...lengthOfSlices: number[]): Array<string> {
    let startIndex = 0;
    const slices = [];
    for (const length of lengthOfSlices) {
      slices.push(mappedArray.slice(startIndex, startIndex + length).join(''));
      startIndex += length;
    }
    return slices;
  }

  private RevertMappedShuffleOrder(mappedArray: Array<number | string>): number[] {
    const selectedShuffleMapper = SHUFFLE_MAPPER[+mappedArray[0]];
    const orderShuffleMapped = mappedArray.slice(1);
    const reverseMapping: Record<string, number> = {};
    Object.keys(selectedShuffleMapper).forEach((key) => {
      const numericKey = parseInt(key, 10);
      reverseMapping[selectedShuffleMapper[numericKey]] = parseInt(key, 10);
    });
    return orderShuffleMapped.map((value) => reverseMapping[value]);
  }

  private RevertShuffledKeyArray(shuffledKey: string, orderArray: number[]): string[] {
    const revertedArray: Array<string> = [];
    let startIndex = 0;
    orderArray.map((order, index) => {
      const foundIndex = orderArray.findIndex((item) => item === index);
      const endIndex = startIndex + this.LENGTHS[foundIndex];
      const slicedString = shuffledKey.slice(startIndex, endIndex);
      startIndex += this.LENGTHS[foundIndex];
      revertedArray[foundIndex] = slicedString;
    });
    return revertedArray;
  }

  extractShuffledKeyAndOrderMapped(traceCode: string) {
    // Extract slice1 from the start
    const slice1 = traceCode.slice(0, 3);

    // Extract slice2 from the end
    const slice2 = traceCode.slice(-3);

    // Extract randomString from the middle
    const shuffledKey = traceCode.slice(3, -3);

    return { shuffledKey, shuffleOrderMapped: [...slice1, ...slice2] };
  }

  /**
   * reverse generateClientTraceCode steps to
   * extract serverPublicKey and serverRandomNumber(n-digit)
   */
  private DecodeServerTraceCode(traceCode: string) {
    const { shuffledKey, shuffleOrderMapped } = this.extractShuffledKeyAndOrderMapped(traceCode);
    const revertedShuffleOrderMapped = this.RevertMappedShuffleOrder(shuffleOrderMapped);
    const sortedArray = this.RevertShuffledKeyArray(shuffledKey, revertedShuffleOrderMapped);
    const contractCode = sortedArray.join('');
    const { publicKey, randomNumber } = this.extractRandomNumberAndPublicKey(contractCode, this.INSERT_SALT_INDEXED);
    const minusRandomNumber = this.getMinusMultiDigitRandomNumberAsString(this.MAX_RANDOM, randomNumber);
    this.serverTraceData = {
      ...this.serverTraceData,
      publicKey,
      randomNumber: minusRandomNumber,
    };
    return this.serverTraceData;
  }

  public observeDecodeServerTraceCode(traceCode: string): Observable<typeof this.serverTraceData> {
    return of(this.DecodeServerTraceCode(traceCode));
  }

  /**
   * fingerprint is a hash based on sharedSecret and contracted string
   */
  private async generateFingerPrint(publicKey: string, hmacInput: string, expireDate: string, encryptedPinDto: string): Promise<string> {
    if (!this.clientPairKey) {
      this.clientPairKey = await this.generatePairKey();
    }
    const sharedSecret = await this.generateSharedSecret(this.clientPairKey.privateKey, publicKey);
    const hash = await this.generateHMAC(hmacInput, sharedSecret);
    return this.shuffleHashCode(expireDate, hash, encryptedPinDto);
  }

  public observeFingerPrint(publicKey: string, hmacInput: string, expireDate: string, encryptedPinDto: string): Observable<string> {
    return from(this.generateFingerPrint(publicKey, hmacInput, expireDate, encryptedPinDto));
  }

  private findPartNumber(expireDate: string): number {
    const mod = +(expireDate.split('/').pop() as string) % 2;
    let partNumber: number;
    switch (mod) {
      case 0:
        partNumber = 4;
        break;
      case 1:
        partNumber = 8;
        break;
      default:
        partNumber = 4;
        break;
    }
    return partNumber;
  }

  private shuffleHashCode(expireDate: string, hash: string, encryptedPinDto: string): string {
    const partNumber = this.findPartNumber(expireDate);
    const hashArray = this.divideStatement(hash, partNumber);
    const arrayIndex = this.encodeFingerPrint(encryptedPinDto, partNumber);
    return this.concatStatement(hashArray, arrayIndex);
  }

  private concatStatement(array: any[], arrayIndex: Array<number>): string {
    const outputArray = Array(arrayIndex.length);
    arrayIndex.forEach((target, index) => {
      outputArray[target] = array[index];
    });
    return outputArray.join('');
  }

  private divideStatement(hash: string, partNumber: number) {
    const partLength = Math.ceil(hash.length / partNumber);
    const result = [];

    for (let i = 0; i < partNumber; i++) {
      result.push(hash.substring(i * partLength, (i + 1) * partLength));
    }
    return result;
  }

  private getCharactersWithOffset(baseString: string, n: number, indexes: number[]): Array<string> {
    let extendedString = baseString;
    const seenCharacters = new Set<string>();
    const result: string[] = [];

    let indexPointer = 0;

    while (result.length < n) {
      // Extend indexes list if needed
      if (indexPointer >= indexes.length) {
        this.messageService.showErrorMessage('مشکلی پیش آمده‌است. لطفا مجدد از ابتدا تلاش کنید');
        return result;
      }

      const index = indexes[indexPointer];

      // Extend base string if needed
      while (index >= extendedString.length) {
        extendedString += baseString;
      }

      const char = extendedString.charAt(index);
      if (!seenCharacters.has(char)) {
        result.push(char);
        seenCharacters.add(char);
      }

      indexPointer++;
    }

    return result;
  }

  private encodeFingerPrint(fingerPrint: string, partNumber: number) {
    const extractedString = this.getCharactersWithOffset(fingerPrint, partNumber, this.EXTRACT_CHARS_INDEXES);
    const sortedAsciiCode = extractedString.map((item) => item.charCodeAt(0)).sort((a, b) => a - b);
    return extractedString.map((item) => sortedAsciiCode.indexOf(item.charCodeAt(0)));
  }

  /**
   * generate hash with hmac algorithm
   */
  private async generateHMAC(hmacInput: string, sharedSecret: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(hmacInput);
    const secretKey = encoder.encode(sharedSecret);
    const sharedSecretImported = await window.crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: atob('SE1BQw=='), hash: atob('U0hBLTI1Ng==') },
      false,
      ['sign', 'verify'],
    );
    const signature = await window.crypto.subtle.sign(atob('SE1BQw=='), sharedSecretImported, data);
    const signatureBuffer = new Uint8Array(signature);
    const signatureHex = bufferToHex(signatureBuffer);
    return signatureHex.toUpperCase();
  }
}
