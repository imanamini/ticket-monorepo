import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PlanServiceConfigDetail } from '../models/plan-service-config.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-plan-service-detail',
  standalone: true,
  templateUrl: './plan-service-detail.component.html',
  styleUrls: ['./plan-service-detail.component.scss'],
  imports: [NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanServiceDetailComponent implements OnInit {
  detail = signal<PlanServiceConfigDetail>({} as PlanServiceConfigDetail);
  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit(): void {
    const bottomSheetData = this.bottomSheetService.data();
    this.detail.set(bottomSheetData.detail);
  }

  clickButton(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
