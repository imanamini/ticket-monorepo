import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { CommonModule } from '@angular/common';
import { EnterNewCardComponent } from '../../components/enter-new-card/enter-new-card.component';
import { C2cMainService } from '../../data-access/services/c2c-main.service';

@Component({
  selector: 'c2c-applet-c2c-new-card-step',
  standalone: true,
  imports: [PageLayoutComponent, CommonModule, EnterNewCardComponent],
  templateUrl: './c2c-new-card-step.component.html',
  styleUrls: ['./c2c-new-card-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cNewCardStepComponent {
  // Injects
  private c2cMainService = inject(C2cMainService);

  onChangeStep() {
    this.c2cMainService.goToNextStep();
  }

  goBack() {
    this.c2cMainService.goToPrevStep();
  }
}
