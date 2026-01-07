import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map } from 'rxjs';
import { FeedbackApiResponse, FeedbackCategory } from '../../data-access/models/feedback';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackMessageComponent } from '../../components/feedback-message/feedback-message.component';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-feedback',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, UiFormFieldBuilderModule, FormsModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent implements OnInit, OnDestroy {
  services: Array<FormFieldOption> = [];
  titles: Array<FormFieldOption> = [
    {
      title: 'گزارش خطا / مشکل',
      value: '1',
    },
    {
      title: 'انتقاد و پیشنهاد',
      value: '2',
    },
    {
      title: 'سوال و ابهام',
      value: '2',
    },
    {
      title: 'سایر',
      value: '3',
    },
  ];

  apiService = inject(ApiService);
  bottomSheetService = inject(NgxBottomSheetService);
  formBuilder = inject(FormBuilder);
  bottomNavigationService = inject(NgxBottomNavigationService);
  form: FormGroup<{
    content: FormControl;
    categoryId: FormControl;
    subCategoryId: FormControl;
  }>;

  constructor() {
    this.form = this.formBuilder.group({
      content: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      subCategoryId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getServices();
    this.bottomNavigationService.hide();
  }

  getServices(): void {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'users/feedback/categories');
    this.apiService
      .call<FeedbackApiResponse>(request)
      .pipe(
        map((response: FeedbackApiResponse) =>
          response.categories.map((c: FeedbackCategory) => {
            return { value: c.id, title: c.name };
          }),
        ),
      )
      .subscribe({
        next: (res) => {
          this.services = res;
        },
      });
  }

  submitFeedback() {
    if (this.form.invalid) {
      return;
    }
    const passToServer = this.form.value;
    const request = new RequestBuilder(RequestTypeEnum.POST, 'users/feedback', passToServer);

    this.apiService.call(request).subscribe({
      next: () => {
        this.bottomSheetService.openBottomSheet(FeedbackMessageComponent, {
          mode: 'success',
        });
      },
      error: () => {
        this.bottomSheetService.openBottomSheet(FeedbackMessageComponent, {
          mode: 'error',
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
