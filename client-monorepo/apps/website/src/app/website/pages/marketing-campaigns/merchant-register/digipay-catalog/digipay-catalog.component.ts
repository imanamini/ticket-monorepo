import { Component, Input } from '@angular/core';
import { HeroSection } from '../merchant-register-response';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-digipay-catalog',
  templateUrl: './digipay-catalog.component.html',
  standalone: true,
  styleUrls: ['./digipay-catalog.component.scss'],
  imports: [UiButtonComponent, NgxIcon],
})
export class DigipayCatalogComponent {
  @Input()
  bannerSection!: HeroSection;
}
