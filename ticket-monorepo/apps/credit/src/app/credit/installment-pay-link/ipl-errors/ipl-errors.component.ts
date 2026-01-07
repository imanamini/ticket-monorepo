import { Component, inject, ViewContainerRef } from '@angular/core';
import { IplErrorService } from './services/ipl-error.service';
import { IplErrorComponentsMapper } from './data-access/ipl-error';

@Component({
  selector: 'ipl-errors',
  standalone: true,
  template: ``,
  imports: [],
})

export class IplErrorsComponent {

  private vcr = inject(ViewContainerRef);
  private iplErrorService = inject(IplErrorService);

  constructor() {
    this.iplErrorService.errorEnum.subscribe(errorEnum => {
      this.vcr.clear();
      this.vcr.createComponent(IplErrorComponentsMapper[errorEnum]);
    });
  }
}
