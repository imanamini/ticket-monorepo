import { ChangeDetectorRef, Component, inject, ViewContainerRef } from '@angular/core';
import { IplErrorService } from './services/ipl-error.service';
import { IplErrorComponentsMapper } from './data-access/ipl-error';
import { CutOffComponent } from './components/cut-off/cut-off.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';

@Component({
  selector: 'ipl-errors',
  standalone: true,
  template: ``,
  imports: [CutOffComponent, NgxStatusResultModule],
})
export class IplErrorsComponent {
  private vcr = inject(ViewContainerRef);
  private iplErrorService = inject(IplErrorService);
  private detectRef = inject(ChangeDetectorRef);

  constructor() {
    this.iplErrorService.errorEnum.subscribe((errorEnum) => {
      this.vcr.clear();
      errorEnum && this.vcr.createComponent(IplErrorComponentsMapper[errorEnum]);
      this.detectRef.markForCheck();
    });
  }
}
