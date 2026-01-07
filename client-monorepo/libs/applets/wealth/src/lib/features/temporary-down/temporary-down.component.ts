import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EIntrackEventName } from '../../components/core/models/intrack-event-name.enum';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'wealth-applet-temporary-down',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent],
  templateUrl: './temporary-down.component.html',
  styleUrl: './temporary-down.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemporaryDownComponent implements OnInit {
  private eventService = inject(NgxEventTrackerService);

  ngOnInit(): void {
    this.eventService.sendEvent({ eventName: EIntrackEventName.TEMPORARY_DOWN, eventData: {} });
  }

  onBackHandler() {
    window.open(window.location.origin, '_self');
  }
}
