import { inject, Injectable, signal } from '@angular/core';
import { UserApiService } from '@client-monorepo/common/user';

@Injectable({
  providedIn: 'root',
})
export class UserCellNumberService {
  cellNumber = signal<string>('');
  private userApiService = inject(UserApiService);

  get(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cellNumber() !== '') {
        resolve(this.cellNumber());
        return;
      } else {
        this.userApiService.getProfile().subscribe({
          next: (result) => {
            this.cellNumber.set(result.cellNumber);
            resolve(this.cellNumber());
          },
          error: (err) => {
            reject(err);
          },
        });
      }
    });
  }
}
