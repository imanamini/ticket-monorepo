import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RegistrationService } from '../../../../registration.service';
import { SignatureDetailsResponse } from '../../../../../../api/models/signature/signature-details.response';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signature-password',
  templateUrl: './signature-password.component.html',
  styleUrl: './signature-password.component.scss'
})
export class SignaturePasswordComponent implements OnInit {
  signatureDetails!: SignatureDetailsResponse;
  @Output() codeChanged = new EventEmitter<string>();
  @Output() cardInfoChanged = new EventEmitter<{}>();

  passwordStatus: string = 'GETTING_PASSWORD';
  code = '';
  errorMessage = '';
  isPassProceed: boolean = false;
  isRePassProceed: boolean = false;
  isCopy: boolean = false;
  isPreview: boolean = false;
  errorData: any;

  constructor(private service: RegistrationService) {
  }

  ngOnInit(): void {
    this.service.passwordStatus.subscribe(status => {
      if (!status) return;
      this.passwordStatus = status;
    });
  }

  onCodeChange(code: string): void {
    if (code && code.length >= 4) {
      this.code = code;
      this.isPassProceed = true;
    } else {
      this.isPassProceed = false;
    }
  }

  onRepeatCodeChange(code: string): void {
    if (code === this.code && code.length >= 4) {
      this.errorMessage = '';
      this.isRePassProceed = true;
    } else if (code !== this.code && code.length >= 4) {
      this.errorMessage = 'تکرار رمز با رمز وارد شده در مرحله قبل یکسان نیست.';
      this.isRePassProceed = false;
    } else if (code.length < 4) {
      this.errorMessage = '';
    }
  }

  continue() {
    this.passwordStatus = 'GETTING_PASSWORD';
    this.cardInfoChanged.emit({
      cardTitle: 'رمز امضای دیجیتال',
      isClose: true,
      isBack: false
    });
    this.service.passwordStatus.next(this.passwordStatus);

  }

  passProceed() {
    this.codeChanged.emit(this.code);
    this.passwordStatus = 'REPEAT_PASSWORD';
    this.errorMessage = '';
    this.cardInfoChanged.emit({
      cardTitle: 'تکرار رمز امضای دیجیتال',
      isClose: false,
      isBack: true
    });
    this.service.passwordStatus.next(this.passwordStatus);

  }

  repeatPassProceed() {
    this.service.generateSignatureForNewUsers(this.code).pipe(
      switchMap(() => {
        return this.service.getSignatureDetailsForNewUsers().pipe(
          map(res => {
            this.signatureDetails = res;
            this.passwordStatus = 'PREVIEW';
            this.cardInfoChanged.emit({
              cardTitle: 'ثبت رمز امضای دیجیتال',
              isClose: true,
              isBack: false
            });
            this.service.passwordStatus.next(this.passwordStatus);
            return res;
          })
        );
      }),
      catchError(e => {
        this.passwordStatus = 'ERROR';
        this.cardInfoChanged.emit({
          cardTitle: 'ثبت رمز امضای دیجیتال',
          isClose: true,
          isBack: false
        });
        this.service.passwordStatus.next(this.passwordStatus);
        this.errorData = {
          title: 'اشکال در ثبت امضای دیجیتال',
          message: 'امضای دیجیتال شما ثبت نشد؛ لطفا مجددا نسبت به ثبت آن اقدام نمایید.',
          buttons: [{
            id: 'primary',
            buttonMode: 'default',
            buttonStyle: 'tinted',
            label: 'تلاش مجدد'
          }],
          staticImage: 'assets/icons/signature-failed.svg'
        };
        return of(null);
      })
    ).subscribe(() => {
    });
  }

  preview() {
    this.service.goToOverviewPage();
  }

  copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.code).then(() => {
        this.isCopy = true;
      });
    }
  }

  onClick(id: string) {
    if (id === 'primary') {
      this.passwordStatus = 'GETTING_PASSWORD';
    }
  }
}
