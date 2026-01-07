import { Component } from '@angular/core';
import { LoginAppletComponent } from '../../../../website/applets/login-applet/login-applet/login-applet.component';

@Component({
  selector: 'app-ui-dialog-login',
  templateUrl: './ui-dialog-login.component.html',
  styleUrls: ['./ui-dialog-login.component.scss'],
  standalone: true,
  imports: [LoginAppletComponent],
})
export class UiDialogLoginComponent {}
