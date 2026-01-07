import {APP_INITIALIZER, ErrorHandler, Injectable, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import {Router} from "@angular/router";
import * as Sentry from "@sentry/angular-ivy";
import { EnvironmentConfig, NgxApiConfigModule } from '@digipay/ngx-api-config';
import { environment } from 'src/environments/environment';
import * as Hammer from 'hammerjs';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from "@angular/platform-browser";
import { NgxEventTrackerModule } from '@digipay/ngx-event-tracker';
import { NgxBottomSheetComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: {direction: Hammer.DIRECTION_ALL},
  } as any;
}

const environmentConfig: EnvironmentConfig = {
  agents: {
    web_agent: environment.web_agent,
    android_agent: environment.android_agent,
    ios_agent: environment.ios_agent,
  },
  client_id: {
    web_clientId: environment.web_username,
    android_clientId: environment.android_hybrid_username,
    ios_clientId: environment.ios_hybrid_username
  },
  client_secret: {
    web_client_secret: environment.web_password,
    android_client_secret: environment.android_hybrid_password,
    ios_client_secret: environment.ios_hybrid_password
  },
  digipayVersion: '2025-01-01',
};
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    UserInterfaceModule,
    HttpClientModule,
    CoreModule,
    HammerModule,
    NgxApiConfigModule.environmentConfig(environmentConfig),
    NgxEventTrackerModule.forRoot({
      platforms: {
        gtm: {
          enabled: true
        },
        intrack: {
          enabled: false
        }
      },
      environment: {
        gtm_id: environment.google_tag_manager_id,
        env: environment.name // 'production', 'staging', etc.
      }
    }),
    NgxBottomSheetComponent
  ],
  providers: [
    MemoryCacheService,
    {
      provide: 'STATE_BOTTOM_SHEET',
      useClass: NgxBottomSheetService
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
