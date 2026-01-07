import { Injectable, signal } from '@angular/core';
import { IplErrorEnum } from '../data-access/ipl-error';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class IplErrorService {

  #errorEnum = signal<IplErrorEnum>(null);

  get errorEnum() {
    return toObservable(this.#errorEnum);
  }

  setErrorEnum(error: IplErrorEnum): void {
    this.#errorEnum.set(error);
  }
}
