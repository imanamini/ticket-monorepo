import { Component, Inject, OnInit } from '@angular/core';
import { NobitexCreditService } from '../../../../../api/clients/nobitex/nobitex-credit.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../services/layout.service';
import { nobitexError } from '../../../../../api/clients/models/nobitex/nobitexError';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-nobitex-error',
  templateUrl: './nobitex-error.component.html',
  styleUrls: ['./nobitex-error.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, UiIconDirective, NgxIcon],
})
export class NobitexErrorComponent implements OnInit {
  iconName = 'icon-not-respond';
  title = 'سرویس‌دهنده در دسترس نیست';
  subtitle = 'لطفا دوباره تلاش کنید';
  link = '';
  actionTitle = 'متوجه شدم';
  subscription: Subscription;
  image;

  constructor(
    private nobitexCredit: NobitexCreditService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    private dialogService: DialogBottomSheetService,
    private layoutService: LayoutService,
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.image = value ? this.bottomSheetData.image : this.dialogData.image;
    });
  }

  ngOnInit(): void {
    this.nobitexCredit.getError().subscribe((error: nobitexError) => {
      this.iconName = error.icon;
      this.title = error.title;
      this.subtitle = error.subtitle;
      if (error.link) {
        this.link = error.link;
      }
      if (error.actionTitle) {
        this.actionTitle = error.actionTitle;
      }
    });
  }

  next() {
    this.dialogService.close(true);
  }

  closeDialog() {
    this.dialogService.close(true);
  }

  openLink(link: string) {
    let url;
    if (link.startsWith('https')) {
      url = link;
    } else {
      url = 'https://' + link;
    }
    window.open(url, '_blank');
  }
}
