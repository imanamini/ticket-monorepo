import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SERVICE_STATUS, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { StatusService } from '../../../data-access/services/status.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'subscription-applet-ui-status',
  templateUrl: './ui-status.component.html',
  standalone: true,
  styleUrls: ['./ui-status.component.scss'],
  imports: [NgStyle],
})
export class UiStatusComponent implements OnChanges {
  @Input() serviceType!: SERVICES_TYPE;
  @Input() status!: SERVICE_STATUS;
  statusConfig!: { text: string; style: { [key: string]: string } };

  constructor(private statusService: StatusService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['serviceType']?.previousValue !== changes?.['serviceType']?.currentValue) {
      this.statusConfig = this.statusService.getStatusConfig(this.serviceType, this.status);
    }
  }
}
