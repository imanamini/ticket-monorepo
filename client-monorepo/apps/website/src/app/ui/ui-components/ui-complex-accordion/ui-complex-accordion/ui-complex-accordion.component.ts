import { Component, EventEmitter, Inject, input, Output, PLATFORM_ID } from '@angular/core';
import { UiComplexAccordion } from '../model/ui-complex-accordion';
import { LANDING_ELEMENT_TYPE } from '../../../../api/clients/models/templates/c-bnpl/landing-element';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { UiComplexAccordionModalsComponent } from '../ui-complex-accordion-modals/ui-complex-accordion-modals.component';
import { LandingElementComponent } from '../../ui-landing-element/landing-element/landing-element.component';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-ui-complex-accordion',
  templateUrl: './ui-complex-accordion.component.html',
  styleUrls: ['./ui-complex-accordion.component.scss'],
  standalone: true,
  imports: [NgClass, LandingElementComponent, NgxButtonComponent],
})
export class UiComplexAccordionComponent {
  section = input<UiComplexAccordion>();
  accordionIndex = input<number>();
  activeAccordion = input<number>();
  isDisabled = input(false);
  type = input(LANDING_ELEMENT_TYPE);

  @Output() setActiveAccordion = new EventEmitter<number>();

  constructor(
    private dialog: DialogBottomSheetService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  selectAccordion(index: number) {
    if (!this.isDisabled()) {
      this.setActiveAccordion.emit(index);
    }
  }

  onClick(event: Event, link?: string) {
    event.stopPropagation();
    const buttonId = (event.target as HTMLElement).id;
    if (this.doesOpenModalById(event)) {
      this.showDialogById(buttonId);
    }
    if (this.doesOpenURLTab(link)) {
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = link;
      }
    }
  }

  doesOpenModalById(event: Event) {
    return !!(event.target as HTMLElement).id;
  }

  doesOpenURLTab(link?: string) {
    return !!link;
  }

  showDialogById(modalId: string) {
    const modalData = this.findModalById(modalId);
    this.dialog.open(UiComplexAccordionModalsComponent, {
      width: '650px',
      modal: modalData,
    });
  }

  findModalById(modalId: string) {
    return this.section().modals.find((m) => m.id === modalId);
  }
}
