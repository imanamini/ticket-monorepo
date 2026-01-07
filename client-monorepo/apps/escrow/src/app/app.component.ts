import { Component, Inject, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VersioningService } from '@client-monorepo/versioning';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'escrow-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'پرداخت دیجی‌پی';
  versioning = inject(VersioningService);
  private eventService = inject(NgxEventTrackerService);
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    this.versioning.run();
    this.eventService.init();
  }
}
