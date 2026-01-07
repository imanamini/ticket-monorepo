import { Component, Input } from '@angular/core';
import { BetaAppTemplate } from '../../../../api/clients/models/templates/beta-app/beta-app-template';
import { BetaAppDialogComponent } from '../beta-app-dialog/beta-app-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-beta-app-introduction',
  templateUrl: './beta-app-introduction.component.html',
  styleUrls: ['./beta-app-introduction.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent],
})
export class BetaAppIntroductionComponent {
  @Input()
  templateData: BetaAppTemplate | null = null;

  constructor(private matDialog: MatDialog) {}

  openBetaAppDialog(): void {
    this.matDialog.open(BetaAppDialogComponent, {
      data: {
        templateData: this.templateData,
      },
    });
  }
}
