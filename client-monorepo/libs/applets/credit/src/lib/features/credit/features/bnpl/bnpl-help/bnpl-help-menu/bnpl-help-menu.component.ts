import { Component, input } from '@angular/core';
import { BnplHelpData } from '../data/models/bnpl-help-data';

@Component({
  selector: 'ui-bnpl-help-menu',
  templateUrl: './bnpl-help-menu.component.html',
  standalone: true,
  styleUrls: ['./bnpl-help-menu.component.scss'],
})
export class BnplHelpMenuComponent {
  data = input<BnplHelpData>();

  scrollTo(sectionIndex: number): void {
    const id = 'bnpl-help-' + sectionIndex;
    (document.getElementById(id) as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
