import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'header-profile-view-dialog',
  templateUrl: './header-profile-view-dialog.component.html',
  styleUrls: ['./header-profile-view-dialog.component.scss']
})
export class HeaderProfileViewDialogComponent implements OnInit {
  details: any;

  constructor(private smartDialog: SmartDialog) {
    this.details = this.smartDialog.data.details;
  }

  ngOnInit(): void {
  }

  onClose() {
    this.smartDialog.close();
  }
}
