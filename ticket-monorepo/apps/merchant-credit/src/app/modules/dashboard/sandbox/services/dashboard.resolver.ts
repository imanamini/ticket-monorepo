import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})

export class DashboardResolver implements Resolve<any> {
  constructor(private dashboardService: DashboardService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.dashboardService.incrementVisitCount('home');
    const visitCount = this.dashboardService.getVisitCount('home');
    if (visitCount == 1) {
      this.dashboardService.setSeenLoadingScreen(true);
      return of(null);
    } else {
      this.dashboardService.setSeenLoadingScreen(false);
      return of(null);
    }
  }
}
