import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { LoginAppletComponent } from '../../../../website/applets/login-applet/login-applet/login-applet.component';
import { UiBottomSheetComponent } from '../ui-bottom-sheet/ui-bottom-sheet.component';

@Component({
  selector: 'app-ui-bottom-sheet-login',
  templateUrl: './ui-bottom-sheet-login.component.html',
  styleUrls: ['./ui-bottom-sheet-login.component.scss'],
  standalone: true,
  imports: [UiBottomSheetComponent, LoginAppletComponent],
})
export class UiBottomSheetLoginComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any) {}
}
