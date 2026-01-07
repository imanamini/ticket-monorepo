import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LayoutService } from '../../data-access/services/layout.service';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'ui-special-dialog',
  templateUrl: './ui-special-dialog.component.html',
  styleUrls: ['./ui-special-dialog.component.scss'],
  standalone: true,
  imports: [CardComponent, NgIf, UiButtonComponent]
})
export class UiSpecialDialogComponent implements OnInit {

  @Input()
  description: string;

  @Input()
  buttonText = '';

  @Input()
  title = '';

  @Output()
  handleOnClick = new EventEmitter();

  size: string;

  constructor(private dialogRef: MatDialogRef<UiSpecialDialogComponent>,
              private sheetRef: MatBottomSheetRef<UiSpecialDialogComponent>,
              private layout: LayoutService) {
  }

  ngOnInit(): void {
    this.setScreenSize();
  }

  setScreenSize(): void {
    this.layout.screenSizeChanged.subscribe(res => {
      this.size = res;
    });
  }

  closeDialog(): void {
    if (this.size === 'XS') {
      return this.sheetRef.dismiss();
    }
    this.dialogRef?.close();
  }

}
