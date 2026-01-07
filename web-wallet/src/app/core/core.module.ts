import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WalletHttpInterceptor } from './http/http.interceptor';
import { MessageService } from './services/message.service';
import { RouteStateService } from './services/route-state/route-state.service';
import { RedirectFormComponent } from './redirect-form/redirect-form.component';
import { UserInterfaceModule } from '../user-interface/user-interface.module';
import { RedirectService } from './services/redirect.service';
import { DevOnlyGuard } from './guards/dev-only.guard';
import { TicketGuard } from './guards/ticket.guard';
import { PageTitleService } from './services/page-title.service';
import { ErrorMessagePipe } from './http/error-message.pipe';

@NgModule({
  declarations: [
    RedirectFormComponent,
    ErrorMessagePipe],
  imports: [
    CommonModule,
    HttpClientModule,
    UserInterfaceModule,
  ],
  exports: [
    RedirectFormComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: WalletHttpInterceptor, multi: true},
    StorageService,
    MessageService,
    RedirectService,
    TicketGuard,
    DevOnlyGuard,
    PageTitleService,
    ErrorMessagePipe,
    {
      provide: 'RouteStateInterface',
      useClass: RouteStateService,
    }
  ]
})
export class CoreModule {
}
