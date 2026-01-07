import { inject, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MetricService } from '../../../../data-access/services/metric.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modal = inject(MatDialog);
  private metricService = inject(MetricService);

  open(
    component: ComponentType<unknown>,
    data?: {
      name?: string;
      [key: string]: any;
    },
    fullPage = true,
  ): MatDialogRef<unknown> {
    if (data.name) {
      this.metricService.sendMetric(data.name, null, null);
    }
    return this.modal.open(component, {
      data: {
        ...data,
        fullPage,
      },
      panelClass: [fullPage ? 'full-page-modal' : undefined],
      minHeight: '100svh',
      maxWidth: '552px',
      closeOnNavigation: true,
    });
  }
}
