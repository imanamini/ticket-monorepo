import { Component, inject } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { RouterOutlet } from '@angular/router';
import { InsuranceHeaderComponent } from '../../../../components/insurance-header/insurance-header.component';
import { CloseService } from '../../data-access/services/shared/close.service';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'third-party',
  standalone: true,
  imports: [InsuranceHeaderComponent, NgxSpinnerModule, RouterOutlet],
  templateUrl: './third-party.component.html',
  styleUrl: './third-party.component.scss',
})
export class ThirdPartyComponent {
  private closeService = inject(CloseService);
  protected digikalaService = inject(InsDigikalaService);

  handleCloseClicked(): void {
    if (this.digikalaService.isDigikala) {
      this.closeService.onGoToHome();
    } else {
      this.closeService.close();
    }
  }
}
