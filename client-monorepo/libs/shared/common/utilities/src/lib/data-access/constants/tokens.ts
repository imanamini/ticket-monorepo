import { InjectionToken } from '@angular/core';

export enum APP_NAME_ENUM {
  DPX = 'dpx',
  EXPRESS = 'express',
  PILLAR = 'pillar',
}

export const APP_NAME = new InjectionToken<APP_NAME_ENUM>('APP_NAME');
