import { Component, OnInit } from '@angular/core';

import { SmartDialog } from '../../services/smart-dialog';

@Component({
  selector: 'app-page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrls: ['./page-dialog.component.scss']
})
export class PageDialogComponent implements OnInit {
  constructor(
    private smartDialog: SmartDialog
  ) {
  }

  ngOnInit() {
  }

  closeButton() {
    this.smartDialog.close({confirmed: true});
  }

}
