import { Injectable, signal } from '@angular/core';
import { GeneralErrorTypes } from '../models/general-error-types';

@Injectable({
  providedIn: 'root',
})
export class GeneralErrorService {
  error = signal<GeneralErrorTypes | null>(null);
  detail = signal<string>('');
  closeAction = signal<'back' | 'close' | 'none'>('back');
}
