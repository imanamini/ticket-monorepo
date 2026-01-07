import {ChangeDetectionStrategy, Component, inject, Inject, input, PLATFORM_ID} from '@angular/core';
import {CommonModule} from '@angular/common';
import {plans} from "../../../../../../../api/clients/models/templates/c-bnpl-v2/CBnplV2Template";
import {DomSanitizer} from "@angular/platform-browser";
import {DeviceDetectorService} from "../../../../../../../core/services/device/deviceDetector.service";

@Component({
  selector: 'app-c-bnpl-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-bnpl-plans.component.html',
  styleUrl: './c-bnpl-plans.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CBnplPlansComponent {

  bnplPlans = input<plans>();
  protected deviceDetector = inject(DeviceDetectorService)

  constructor(private sanitizer: DomSanitizer) {
  }


  toggleFlip(plan: any) {
    if (this.deviceDetector.isMobile()) {
      plan.isFlipped = !plan.isFlipped;
    }
  }

  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
