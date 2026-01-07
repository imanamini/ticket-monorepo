import { Component, HostListener, Inject, Input, PLATFORM_ID } from '@angular/core';
import { BillBenefits } from '../../../../api/clients/models/templates/bill/bill-template-data';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiBasicSegmentComponent } from '../../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-bill-benefit',
  templateUrl: './bill-benefit.component.html',
  styleUrls: ['./bill-benefit.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiBasicSegmentComponent, NgClass, UiButtonComponent],
})
export class BillBenefitComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  benefits!: BillBenefits[];

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    this.reveal();
  }

  reveal() {
    if (isPlatformBrowser(this.platformId)) {
      const reveals = document.querySelectorAll('.basic-segment');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          if (i % 2 != 0) {
            reveals[i].classList.add('fade-right');
          } else {
            reveals[i].classList.add('fade-left');
          }
        }
      }
    }
  }
}
