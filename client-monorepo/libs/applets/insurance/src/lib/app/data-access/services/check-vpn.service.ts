import { HostListener, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MetricService } from './metric.service';

@Injectable({
  providedIn: 'root'
})
export class CheckVpnService {
  private metricService = inject(MetricService);
  private isUserUseVpnSource = new BehaviorSubject<boolean>(false);

  @HostListener('window:focus', ['$event'])
  onTabFocus(): void {
    this.checkUseVpn();
  }

  checkUseVpn(): Observable<boolean> {
    fetch('https://www.cloudflare.com/cdn-cgi/trace').then(res => {
      if (res.ok) {
        res.text().then(text => {
          const hasVpn = !text.includes('loc=IR');
          if (hasVpn) {
            this.metricService.sendMetric('HasVpn', null, null);
          } else {
            this.metricService.sendMetric('NoVpn', null, null);
          }
          this.isUserUseVpnSource.next(hasVpn);
        });
      }
    });
    return this.isUserUseVpnSource.asObservable();
  }
}
