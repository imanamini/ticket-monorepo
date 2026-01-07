import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../../../data-access/utils/url';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-bnpl-landing-intro',
  standalone: true,
  imports: [NgxButtonComponent, NgxIcon],
  templateUrl: './bnpl-landing-intro.component.html',
  styleUrl: './bnpl-landing-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplLandingIntroComponent {
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);

  scrollToElement(element: string): void {
    const el = document.getElementById(element);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  goToActivation(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/campaign/activation')).then(() => {});
  }
}
