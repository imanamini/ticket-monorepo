import { Component, inject, OnInit } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';
import { ApplicationFormService } from '../../services/application-form.service';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { PreviewShowIssuedPolicyComponent } from './preview-show-issued-policy/preview-show-issued-policy.component';
import { BaseComponent } from '../../../../components/base/base.component';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';

@Component({
  selector: 'issued-policy',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './issued-policy.component.html',
  styleUrl: './issued-policy.component.scss',
})
export class IssuedPolicyComponent extends BaseComponent implements OnInit {
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  private router = inject(Router);
  private applicationFormService = inject(ApplicationFormService);
  private formId: string;
  private previewPolicy: string;
  bottomSheetService = inject(BottomSheetService);

  ngOnInit(): void {
    this.readQueryParam();
    this.setCompleteApplicationForm();
  }

  readQueryParam(): void {
    this.formId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
  }

  public onGoToMyPolicies(): void {
    this.router.navigate(['/policy', 'list'], {
      queryParams: {
        type: 'digital-equipment',
        status: 0,
      },
    });
  }

  private setCompleteApplicationForm(): void {
    const subscription = this.applicationFormService.completions(this.formId).subscribe({
      next: (res) => {
        this.previewPolicy = res.result.fileName;
      },
    });
    super.addSubscription(subscription);
  }

  public onShowPolicy(): void {
    super.addSubscription(
      this.bottomSheetService
        .open(
          BottomSheetBoxComponent,
          {
            component: PreviewShowIssuedPolicyComponent,
            name: 'PreviewShowIssuedPolicyBottomSheet',
          },
          { fullPage: true },
        )
        .afterDismissed()
        .subscribe({}),
    );
  }
}
