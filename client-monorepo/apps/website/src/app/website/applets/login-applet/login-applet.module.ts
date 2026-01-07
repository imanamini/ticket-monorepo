import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginAppletComponent } from './login-applet/login-applet.component';

import { ReactiveFormsModule } from '@angular/forms';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormDirectivesModule } from '@digipay/ng-form-directives';

@NgModule({
  exports: [LoginAppletComponent],
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule, NgOptimizedImage, FormDirectivesModule, LoginAppletComponent],
})
export class LoginAppletModule {}
