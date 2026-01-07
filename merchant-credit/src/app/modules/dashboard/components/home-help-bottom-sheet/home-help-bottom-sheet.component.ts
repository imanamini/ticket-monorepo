import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-home-help-bottom-sheet',
  templateUrl: './home-help-bottom-sheet.component.html',
  styleUrls: ['./home-help-bottom-sheet.component.scss']
})
export class HomeHelpBottomSheetComponent implements OnInit {

  @Input() title: string = '';
  @Input() description: string = '';

  constructor(
    private matBottomSheetRef: MatBottomSheetRef<HomeHelpBottomSheetComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  close() {
    this.matBottomSheetRef.dismiss();
  }

  submitFilter() {

  }
}
