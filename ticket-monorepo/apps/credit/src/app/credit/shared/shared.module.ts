import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { NumberDirective } from './directives/only-number.directive';
import { DisableControlDirective } from './directives/disable-control.directive';
import { IranianRialsPipe } from './pipes/iranian-rials.pipe';
import { DigipayImageComponent } from './components/digipay-image/digipay-image.component';
import { PageLoadingComponent } from './components/page-loading/page-loading.component';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { CellNumberInputDirective } from './directives/cell-number-input.directive';
import { NumericKeyboardDirective } from './directives/numeric-keyboard.directive';
import { MaxlengthDirective } from './directives/maxlength.directive';
import { CacheService } from './services/cache.service';
import { JalaliDatePipe } from './pipes/jalali-date.pipe';
import { CircleInputDirective } from './directives/black-circle-input.directive';
import { WithoutCreditComponent } from './components/without-credit/without-credit.component';
import { CreditHeaderComponent } from './components/credit-header/credit-header.component';
import { PayDetailsInformationComponent } from './components/pay-details-information/pay-details-information.component';
import {
  PayDetailsCardComponent
} from './components/pay-details-information/pay-details-card/pay-details-card.component';
import {
  PayDetailsFooterPlaceholderComponent
} from './components/pay-details-information/pay-details-footer-placeholder/pay-details-footer-placeholder.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent } from '../credit-ui/button/button.component';
import { UiFaqComponent } from './components/ui-faq/ui-faq.component';
import { UiIconModule } from './components/ui-icon/ui-icon.module';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ScrollableViewComponent } from './components/scrollable-view/scrollable-view.component';

export const maskOptions: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule,
    MatTabsModule,
    MatRippleModule,
    MatCheckboxModule,
    CarouselModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    UiIconModule,
    NgxSpinnerModule,
    NgxButtonComponent,
    ScrollableViewComponent,
  ],
  declarations: [
    NumberDirective,
    DisableControlDirective,
    IranianRialsPipe,
    DigipayImageComponent,
    PageLoadingComponent,
    CellNumberInputDirective,
    NumericKeyboardDirective,
    MaxlengthDirective,
    JalaliDatePipe,
    CircleInputDirective,
    WithoutCreditComponent,
    CreditHeaderComponent,
    PayDetailsInformationComponent,
    PayDetailsCardComponent,
    PayDetailsFooterPlaceholderComponent,
    ButtonComponent,
    UiFaqComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule,
    MatTabsModule,
    NumberDirective,
    DisableControlDirective,
    CarouselModule,
    IranianRialsPipe,
    MatSelectModule,
    MatOptionModule,
    MatRippleModule,
    MatCheckboxModule,
    DigipayImageComponent,
    PageLoadingComponent,
    CellNumberInputDirective,
    NumericKeyboardDirective,
    MaxlengthDirective,
    JalaliDatePipe,
    CircleInputDirective,
    WithoutCreditComponent,
    CreditHeaderComponent,
    PayDetailsInformationComponent,
    PayDetailsCardComponent,
    PayDetailsFooterPlaceholderComponent,
    ButtonComponent,
    UiFaqComponent
  ],
  providers: [
    CacheService,
    provideEnvironmentNgxMask(maskOptions)
  ]
})
export class SharedModule {
}
