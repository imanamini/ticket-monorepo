import { Component, Input } from '@angular/core';
import { BnplUsageTutorial } from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-bnpl-usage-tutorial',
  templateUrl: './bnpl-usage-tutorial.component.html',
  styleUrls: ['./bnpl-usage-tutorial.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgOptimizedImage],
})
export class BnplUsageTutorialComponent {
  @Input() bnplUsageTutorialData: BnplUsageTutorial;
}
