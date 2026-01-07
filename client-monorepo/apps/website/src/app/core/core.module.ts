import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './http/app.interceptor';
import { DEFAULT_TIMEOUT, HttpTokenInterceptor } from './interceptors';
import { DomLocalStorage, InMemoryStorage } from '@digipay/ng-storage';
import { UiDialogsModule } from '../ui/ui-components/ui-dialogs/ui-dialogs.module';

@NgModule({
  imports: [CommonModule, UiDialogsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 60000 },
    {
      provide: 'STORAGE_KEY',
      useValue: '__dg_website',
    },
    {
      provide: 'StorageInterface',
      useClass: DomLocalStorage,
    },
    {
      provide: 'InMemoryStorageService',
      useClass: InMemoryStorage,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
