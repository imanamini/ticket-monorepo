import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { getTacUrl } from '../utiles/storage';
import { ScreenService } from './screen.service';
import {PageDialogComponent} from "../components/page-dialog/page-dialog.component";

@Injectable()
export class TacService {
  private matDialog = inject(MatDialog);
  private screenService = inject(ScreenService);
  private bottomSheet = inject(MatBottomSheet);

  open(): void {
    const tacUrl: string = getTacUrl();
    switch (this.screenService.detectScreen()) {
      case 'DESKTOP':
        this.matDialog.open(PageDialogComponent, {
          panelClass: ['page-dialog-component'],
          data: {
            title: 'قوانین و مقررات',
            pageId: this.createPageId(tacUrl),
          }
        });
        break;

      case 'MOBILE':
        this.bottomSheet.open(PageDialogComponent, {
          panelClass: ['page-bottom-sheet'],
          data: {
            title: 'قوانین و مقررات',
            pageId: this.createPageId(tacUrl),
          }
        });
        break;
    }
  }

  private createPageId(url: string): string {
    return url.substr(url.lastIndexOf('/') + 1);
  }
}
