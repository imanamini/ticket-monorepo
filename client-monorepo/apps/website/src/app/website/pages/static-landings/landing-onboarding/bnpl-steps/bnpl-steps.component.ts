import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {purchaseSteps} from "../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-bnpl-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bnpl-steps.component.html',
  styleUrl: './bnpl-steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplStepsComponent {

  purchaseStep = input<purchaseSteps>();
  blackFridayMode = input<boolean>(false);
  bnplMode = input<boolean>(false);

  constructor(private sanitizer: DomSanitizer) {
  }

  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

}
