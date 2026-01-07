import { Component } from '@angular/core';
import { HandleBottomSheetComponent } from '../handle-bottom-sheet/handle-bottom-sheet.component';

@Component({
  selector: 'app-ui-bottom-sheet',
  templateUrl: './ui-bottom-sheet.component.html',
  styleUrls: ['./ui-bottom-sheet.component.scss'],
  standalone: true,
  imports: [HandleBottomSheetComponent],
})
export class UiBottomSheetComponent {}
