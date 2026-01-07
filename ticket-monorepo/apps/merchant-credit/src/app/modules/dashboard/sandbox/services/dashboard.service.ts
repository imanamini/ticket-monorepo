import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private visitCounts: { [key: string]: number } = {};
  private hasSeenLoadingScreen = false;

  constructor() {
  }

  incrementVisitCount(route: string): void {
    if (this.visitCounts[route]) {
      this.visitCounts[route]++;
    } else {
      this.visitCounts[route] = 1;
    }
  }

  getVisitCount(route: string): number {
    return this.visitCounts[route] || 0;
  }

  setSeenLoadingScreen(value: boolean) {
    this.hasSeenLoadingScreen = value;
  }

  getSeenLoadingScreen() {
    return this.hasSeenLoadingScreen;
  }

}
