import { Injectable } from '@angular/core';

import { StorageKeysEnum } from '../../enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})

export class MachineService {
  getMachineId(): string {
    return localStorage.getItem(StorageKeysEnum.KEY_MACHINE_ID_STORAGE);
  }

  setMachineId(machineId: string): void {
    localStorage.setItem(StorageKeysEnum.KEY_MACHINE_ID_STORAGE, machineId);
  }
}
