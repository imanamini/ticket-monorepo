import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorMessageInterceptor } from './error-message.interceptor';
import { importProvidersFrom } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { APP_BASE_HREF } from '@angular/common';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HammerConfig } from '../services/hammer-config.service';
import { environment } from '../../../../../../../../apps/dpx/src/environments/environment';

export const httpInsuranceInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorMessageInterceptor, multi: true },
  importProvidersFrom(MatBottomSheetModule),
  importProvidersFrom(MatDialogModule),
  {
    provide: MAT_DIALOG_DATA,
    useValue: [],
  },
  {
    provide: MAT_BOTTOM_SHEET_DATA,
    useValue: [],
  },
  {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig,
  },
  {
    provide: MatDialogRef,
    useValue: {},
  },
  {
    provide: MatBottomSheetRef,
    useValue: {},
  },
  { provide: APP_BASE_HREF, useValue: environment.insurance.base_href },
];
