import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NgxButtonComponent} from "@digipay/ngx-button";
import {SectionRegistration} from "../../../../api/clients/models/templates/c-credit/c-credit-v2-template-data";
import {DomSanitizer} from "@angular/platform-browser";
import {
  sectionValueProposition
} from "../../../../api/clients/models/templates/branches-address/branches-address-template-data";

@Component({
  selector: 'app-branches-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxButtonComponent],
  templateUrl: './branchesHeader.component.html',
  styleUrl: './branchesHeader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchesHeaderComponent {


  data = input<sectionValueProposition>();

  constructor(private sanitizer:DomSanitizer) {
  }

  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
