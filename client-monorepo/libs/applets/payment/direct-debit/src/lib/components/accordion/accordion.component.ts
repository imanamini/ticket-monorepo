import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';

@Component({
  selector: 'direct-debit-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent implements AccordionWithIsOpen {
  componentId = input<string>('');
  accordionStateService = inject(AccordionStateService);
  isOpen = input<boolean>(false);
  data = input<string>('');

}
 