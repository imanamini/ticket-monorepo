import { Injectable, signal } from '@angular/core';

@Injectable()
export class TokenService {

  #token = signal<string>(null);

  constructor() {
  }

  get token() {
    return this.#token.asReadonly();
  }

  setToken(token: string) {
    this.#token.set(token);
  }
}
