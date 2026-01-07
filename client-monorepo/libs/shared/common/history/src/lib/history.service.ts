import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.history.push(event.urlAfterRedirects);
    });
  }

  getHistory(): string[] {
    return this.history;
  }
}
