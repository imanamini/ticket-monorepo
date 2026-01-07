import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { CreditRegisterFormComponent } from '../../../components/credit-register-form/credit-register-form.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-registration-by-underwriter-form',
  templateUrl: './credit-registration-by-underwriter-form.component.html',
  styleUrls: ['./credit-registration-by-underwriter-form.component.scss'],
  imports: [CreditRegisterFormComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditRegistrationByUnderwriterFormComponent {
  values = signal<{ birthDate: number | null; nationalCode: string | null }>({
    birthDate: null,
    nationalCode: null,
  });
  serverValidationError = signal({});

  submit = output<{ nationalCode: string; birthDate: number }>();
  close = output();

  private destroyRef = inject(DestroyRef);
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });
  }

  onClose() {
    if (!this.destroyed) {
      this.close.emit();
    }
  }

  submitForm(data: { birthDate: number; nationalCode: string }) {
    if (!this.destroyed) {
      this.submit.emit(data);
    }
  }
}
