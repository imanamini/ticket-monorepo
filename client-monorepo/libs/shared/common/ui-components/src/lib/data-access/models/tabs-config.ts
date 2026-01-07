import { WritableSignal } from '@angular/core';

export type TabConfig = {
  id?: string | number;
  label: WritableSignal<string>;
  isActive: WritableSignal<boolean>;
  component: WritableSignal<any>;
  relatedChildLink?: string;
};
