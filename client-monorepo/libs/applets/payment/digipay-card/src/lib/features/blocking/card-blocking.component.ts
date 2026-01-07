import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'digipay-card-applet-card-blocking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
    DpIconComponent,
    NgxCalloutComponent,
    PageLayoutComponent,
  ],
  templateUrl: './card-blocking.component.html',
  styleUrl: './card-blocking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBlockingComponent {
  maskedPassword = signal<boolean>(true);
  messageService = inject(MessageService);
  form = new FormGroup({
    password: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
  });
  onSubmitForm() {
    this.messageService.showErrorMessage('رمز ۴ رقمی کارت اشتباه است.');
  }
  changeMaskedStatus() {
    this.maskedPassword.update((prev) => !prev);
  }
}
