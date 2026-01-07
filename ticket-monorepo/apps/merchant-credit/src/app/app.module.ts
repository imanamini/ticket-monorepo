import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppHttpInterceptor } from './api/http-interceptor';
import { HomeComponent } from './home/home.component';
import { SnackContainerComponent } from '@digipay/ngx-snackbar';
import { NgxEventTrackerModule } from '@digipay/ngx-event-tracker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SnackContainerComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true},
    importProvidersFrom(
      NgxEventTrackerModule.forRoot({
        platforms: {
          gtm: {
            enabled: true,
          },
          intrack: {
            enabled: false,
          },
        },
        environment: {
          gtm_id: environment.google_tag_manager_id,
          intrack_config: environment.intrack_config,
          env: environment.name, // 'production', 'staging', etc.
        },
      }),
    ),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
