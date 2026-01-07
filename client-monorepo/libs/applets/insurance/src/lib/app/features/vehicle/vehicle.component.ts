import { Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MetricService } from '../../data-access/services/metric.service';

@Component({
  selector: 'vehicle',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  metricService = inject(MetricService);
  ngZone = inject(NgZone);

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.metricService.sendRouteChangeMetrics();
    });
  }
}
