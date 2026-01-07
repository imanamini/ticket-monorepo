import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EditBankCardAliasService {
  protected _done: Subject<boolean> = new Subject<boolean>();

  onDone() {
    return this._done.asObservable();
  }

  done(result: boolean) {
    this._done.next(result);
  }
}
