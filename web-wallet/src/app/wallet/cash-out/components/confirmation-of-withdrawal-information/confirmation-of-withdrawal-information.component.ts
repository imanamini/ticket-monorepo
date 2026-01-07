import { Component, inject, OnInit } from '@angular/core';
import { ScreenType } from '../../models/screen.type';
import { ScreenService } from '../../services/screen.service';

@Component({
  selector: 'confirmation-of-withdrawal-information',
  templateUrl: './confirmation-of-withdrawal-information.component.html',
  styleUrls: ['./confirmation-of-withdrawal-information.component.scss']
})
export class ConfirmationOfWithdrawalInformationComponent implements OnInit {
  private screenService = inject(ScreenService);
  public screenMode: ScreenType;
  public title: string = 'بررسی اطلاعات برداشت';

  ngOnInit(): void {
    this.getScreenMode();
  }

  private getScreenMode(): void {
    this.screenMode = this.screenService.detectScreen();
  }
}
