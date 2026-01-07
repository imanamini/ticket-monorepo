import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalStylesComponent } from './global-styles/global-styles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './home-page/home-page.component';
import { HttpClientModule } from '@angular/common/http';
import { CreditRootComponent } from './credit/credit-root/credit-root.component';
import { CreditModule } from './credit/module/credit.module';
import { NgxApiConfigModule } from '@digipay/ngx-api-config';
import { environmentConfig } from './credit/core/constants';
import { NgxBottomSheetComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@NgModule({
  declarations: [
    AppComponent,
    GlobalStylesComponent,
    HomePageComponent,
    CreditRootComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CreditModule,
    NgxApiConfigModule.environmentConfig(environmentConfig),
    NgxBottomSheetComponent
  ],
  providers: [
    {
      provide: 'STATE_BOTTOM_SHEET',
      useClass: NgxBottomSheetService,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
