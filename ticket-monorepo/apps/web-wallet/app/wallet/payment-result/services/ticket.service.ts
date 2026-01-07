import { Injectable } from '@angular/core';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService
  ) {
  }

  public get(): string {
    let ticket = this.route.snapshot.paramMap.get('ticket');
    const cashInTicket = this.storage.getPersistantItem(PERSISTENT_STORAGE_KEYS.CASH_IN);
    if (ticket === null && cashInTicket) {
      ticket = cashInTicket;
    }
    return ticket;
  }

  public addToStorage(): void {
    this.storage.put({
      ticket: this.get()
    });
  }
}
