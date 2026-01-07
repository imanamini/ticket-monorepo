import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShareUploadLinkService } from '../../../services/share-upload-link.service';
import { QueryParamsEnum } from '../../../enums/query-params.enum';
import { BaseComponent } from '../../../../../components/base/base.component';
import { BottomSheetService } from '../../../../../data-access/services/bottom-sheet.service';

@Component({
  selector: 'send-sms-link',
  standalone: true,
  imports: [NgxIcon, NgxButtonComponent, ReactiveFormsModule],
  templateUrl: './send-sms-link.component.html',
  styleUrl: './send-sms-link.component.scss',
})
export class SendSmsLinkComponent extends BaseComponent implements OnInit {
  private readonly shareUploadLinkService = inject(ShareUploadLinkService);
  private readonly bottomSheetService = inject(BottomSheetService);
  protected phoneNumberFormControl = signal<FormControl>(new FormControl('', [Validators.pattern(/^09\d{9}$/), Validators.required]));
  protected hasError = signal<boolean>(false);
  protected isSendingSms = signal<boolean>(false);
  private formId: string;

  ngOnInit(): void {
    this.formId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
  }

  protected onSendSMS(): void {
    if (this.phoneNumberFormControl().invalid) {
      return;
    }
    this.hasError.set(false);
    this.isSendingSms.set(true);
    const subscription = this.shareUploadLinkService.sendSmsUploadLink(this.formId, this.phoneNumberFormControl().value).subscribe({
      next: (): void => {
        this.isSendingSms.set(false);
        this.bottomSheetService.closeCurrentBottomSheet({
          result: 'success',
          phoneNumber: this.phoneNumberFormControl().value,
        });
      },
      error: () => {
        this.isSendingSms.set(false);
        this.hasError.set(true);
      },
    });
    this.addSubscription(subscription);
  }
}
