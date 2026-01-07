import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CreditNavigationService } from '../../../../data-access/services/credit-navigation.service';
import { BnplLandingSupportComponent } from './bnpl-landing-support/bnpl-landing-support.component';
import { BnplLandingQAndASectionComponent } from './bnpl-landing-q-and-a-section/bnpl-landing-q-and-a-section.component';
import { BnplLandingGuideSectionComponent } from './bnpl-landing-guide-section/bnpl-landing-guide-section.component';
import { BnplLandingIntroComponent } from './bnpl-landing-intro/bnpl-landing-intro.component';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-bnpl-landing',
  templateUrl: './bnpl-landing.component.html',
  styleUrls: ['./bnpl-landing.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    BnplLandingIntroComponent,
    BnplLandingGuideSectionComponent,
    BnplLandingQAndASectionComponent,
    BnplLandingSupportComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplLandingComponent {
  private creditNavigationService = inject(CreditNavigationService);

  closeService(): void {
    this.creditNavigationService.closeService();
  }
}
