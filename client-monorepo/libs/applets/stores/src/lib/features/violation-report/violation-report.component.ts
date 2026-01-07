import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { ViolationPurchaseStatusSelectorComponent } from '../../components/violation-purchase-status-selector/violation-purchase-status-selector.component';
import { ActivatedRoute } from '@angular/router';
import { ViolationService } from '../../data-access/services/violation.service';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { ViolationFinalComponent } from '../../components/violation-final/violation-final.component';
import { ViolationStepperComponent } from '../../components/violation-stepper/violation-stepper.component';

@Component({
  selector: 'stores-applet-violation-report',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, ViolationPurchaseStatusSelectorComponent, ViolationFinalComponent, ViolationStepperComponent],
  providers: [ViolationService],
  templateUrl: './violation-report.component.html',
  styleUrl: './violation-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationReportComponent implements OnInit, OnDestroy {
  // Injections
  backHandler = inject(BackHandlerService);
  violationService = inject(ViolationService);
  route = inject(ActivatedRoute);
  bottomNavigationService = inject(NgxBottomNavigationService);

  // Variables
  sectionToShow = this.violationService.sectionToShow;

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    this.getSource();
  }

  getSource(): void {
    this.violationService.params.set(this.route.snapshot.queryParams);
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
  }
}
