import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditProfileStatusBaseComponent } from '../credit-profile-status-base/credit-profile-status-base.component';
import { CreditRegisterFormComponent } from '../../../components/credit-register-form/credit-register-form.component';

@Component({
  selector: 'app-credit-profile-register-form',
  templateUrl: './credit-profile-register-form.component.html',
  styleUrls: ['./credit-profile-register-form.component.scss'],
  standalone: true,
  imports: [CreditRegisterFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileRegisterFormComponent extends CreditProfileStatusBaseComponent implements OnInit {
  cellNumber = signal<any>(null);
  values = signal<any>(null);
  ctaLoading = signal<boolean | null>(null);
  serverValidationError = signal<{ nationalCode?: string; birthDate?: string }>({});
  private destroyed = false;

  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    this.setServerErrors();
  }

  setServerErrors(): void {
    if (this.profileStatusData()?.fieldErrors) {
      this.profileStatusData()?.fieldErrors?.forEach((fieldError) => {
        if (fieldError.fieldName === 'nationalCode' || fieldError.fieldName === 'birthDate') {
          this.serverValidationError.update((validation) => ({
            ...validation,
            [fieldError.fieldName]: fieldError.text,
          }));
        }
      });
    }
  }

  submitForm($event: { nationalCode: string; birthDate: number }): void {
    this.ctaLoading.set(true);
    this.creditApiService.preRegisterCorrection(this.creditId()!, { birthDate: $event.birthDate }).subscribe({
      next: () => {
        // Defer signal writes to escape reactive context
        setTimeout(() => {
          if (!this.destroyed) {
            this.ctaLoading.set(false);
            this.reloadStatus.emit();
          }
        }, 0);
      },
      error: (error) => {
        // Defer signal writes to escape reactive context
        setTimeout(() => {
          if (!this.destroyed) {
            this.messageService.showErrorOfErrorResponse(error);
          }
        }, 0);
      },
    });
  }
}
