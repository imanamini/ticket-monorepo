import { Component, ElementRef, ViewChild } from '@angular/core';
import { CreditPayService } from '../../shared/services/credit-pay.service';
import { StorageService } from '../../core/services/storage.service';
import { Redirect } from '../../api/purchase/redirect.model';

@Component({
  selector: 'app-cancel-and-go-back',
  templateUrl: './cancel-and-go-back.component.html',
  styleUrls: ['./cancel-and-go-back.component.scss']
})
export class CancelAndGoBackComponent {

  cancelRedirect: Redirect;

  errorHappened = false;

  @ViewChild('cancelForm', {
    static: false,
  })
  cancelForm: ElementRef<HTMLFormElement>;

  formUrl: string;
  formMethod: 'GET' | 'POST';
  formData: { key: string, value: string }[];

  constructor(
    private payService: CreditPayService,
    private storageService: StorageService,
  ) {
    this.getCancelRedirect().then(response => {
      this.cancelRedirect = response;
      this.formData = [];
      this.formUrl = this.cancelRedirect.url;
      this.formMethod = this.cancelRedirect.redirectMethod;
      let redirectData;
      try {
        redirectData = JSON.parse(this.cancelRedirect.data);
      } catch (e) {
      }
      if (redirectData) {
        Object.keys(redirectData).forEach(key => {
          this.formData.push({
            key,
            value: redirectData[key]
          });
        });
      }
      setTimeout(() => {
        if (this.cancelForm) {
          this.cancelForm.nativeElement.submit();
        }
      }, 150);
    });
  }

  getCancelRedirect(): Promise<Redirect> {
    return new Promise<Redirect>((resolve, reject) => {
      if (this.storageService.get('cancelRedirect')) {
        resolve(this.storageService.get('cancelRedirect'));
      } else {
        this.payService.getTicketInfo().then(response => {
          resolve(response.cancelRedirect);
        }).catch(_ => this.errorHappened = true);
      }
    });
  }

}
