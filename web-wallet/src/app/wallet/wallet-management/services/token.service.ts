import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  private token: string;

  public get(): string {
    return this.token;
  }

  public set(token: string): void {
    this.token = token;
  }
}
