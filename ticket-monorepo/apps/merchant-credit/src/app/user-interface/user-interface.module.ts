import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from './ui-components/ui-button/ui-button.component';
import { PageLoadingComponent } from './ui-components/page-loading/page-loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiStepperComponent } from './ui-components/ui-stepper/ui-stepper.component';
import { TitleBarComponent } from './ui-components/title-bar/title-bar.component';
import { ScrollableViewComponent } from './ui-components/credit-scrollable-view/scrollable-view.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CardLayoutComponent } from './ui-components/card-layout/card-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NumericKeyboardDirective } from './directives/numeric-keyboard.directive';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from './ui-components/page-header/page-header.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PersianDatePipe } from './pipes/persian-date.pipe';
import { PageDialogComponent } from './ui-components/page-dialog/page-dialog.component';
import { GrayCardLayoutComponent } from './ui-components/gray-card-layout/gray-card-layout.component';
import { UiSpinnerComponent } from './ui-components/ui-spinner/ui-spinner.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiNoteModule } from './ui-components/ui-note/ui-note.module';
import { UiFormModule } from './ui-components/ui-form/ui-form.module';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiReceiptModule } from './ui-components/ui-receipt/ui-receipt.module';
import { UiTimeModule } from './ui-components/ui-time/ui-time.module';
import { UiListModule } from './ui-components/ui-list/ui-list.module';
import { ProgressBarLoadingComponent } from './ui-components/progress-bar-loading/progress-bar-loading.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgButtonModule } from '@digipay/ng-button';
import { UiHintMessageComponent } from './ui-components/ui-hint-message/ui-hint-message.component';
import { NoServiceErrorComponent } from './ui-components/no-service-error/no-service-error.component';
import { EmptyStateComponent } from './ui-components/empty-state/empty-state.component';
import { InputAmountComponent } from './ui-components/input-amount/input-amount.component';
import { UiPaginationComponent } from './ui-components/ui-pagination/ui-pagination.component';
import { UiStatusTabsComponent } from './ui-components/ui-status-tabs/ui-status-tabs.component';
import {
  GeneralTermsConditionsComponent
} from './ui-components/general-terms-conditions/general-terms-conditions.component';
import { SmartDialog } from './services/smart-dialog';
import { NumericInputDirective } from './directives/numeric-input.directive';
import { NumberToStringPipe } from './pipes/number-to-string.pipe';

@NgModule({
  declarations: [
    UiButtonComponent,
    PageLoadingComponent,
    UiStepperComponent,
    TitleBarComponent,
    ScrollableViewComponent,
    NumericKeyboardDirective,
    NumericInputDirective,
    CardLayoutComponent,
    PageHeaderComponent,
    PersianDatePipe,
    NumberToStringPipe,
    PageDialogComponent,
    GrayCardLayoutComponent,
    UiSpinnerComponent,
    ProgressBarLoadingComponent,
    UiHintMessageComponent,
    NoServiceErrorComponent,
    EmptyStateComponent,
    InputAmountComponent,
    UiPaginationComponent,
    UiStatusTabsComponent,
    GeneralTermsConditionsComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatBottomSheetModule,
    PipesModule,
    UiNoteModule,
    UiFormModule,
    UiFormFieldBuilderModule,
    UiReceiptModule,
    UiTimeModule,
    UiListModule,
    MatProgressBarModule,
    NgButtonModule
  ],
  exports: [
    UiButtonComponent,
    PageLoadingComponent,
    TitleBarComponent,
    ScrollableViewComponent,
    CardLayoutComponent,
    PageHeaderComponent,
    MatBottomSheetModule,
    PersianDatePipe,
    NumberToStringPipe,
    PageDialogComponent,
    GrayCardLayoutComponent,
    UiSpinnerComponent,
    PipesModule,
    UiNoteModule,
    UiFormModule,
    UiFormFieldBuilderModule,
    NumericInputDirective,
    NumericKeyboardDirective,
    UiReceiptModule,
    UiTimeModule,
    UiListModule,
    ProgressBarLoadingComponent,
    UiHintMessageComponent,
    NoServiceErrorComponent,
    EmptyStateComponent,
    InputAmountComponent,
    UiPaginationComponent,
    UiStatusTabsComponent,
    GeneralTermsConditionsComponent
  ],
  providers: [
    SmartDialog]
})
export class UserInterfaceModule {
}
