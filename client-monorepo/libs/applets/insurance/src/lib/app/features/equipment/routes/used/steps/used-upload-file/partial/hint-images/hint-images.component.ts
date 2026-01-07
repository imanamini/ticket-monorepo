import { Component, OnDestroy, OnInit, output } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GuideCardModel } from '../../model/guide-card.model';
import { GuideCardComponent } from '../guide-card/guide-card.component';

@Component({
  selector: 'hint-images',
  standalone: true,
  imports: [
    ApiImageModule,
    GuideCardComponent
  ],
  templateUrl: './hint-images.component.html',
  styleUrl: './hint-images.component.scss'
})
export class HintImagesComponent implements OnInit, OnDestroy {
  constructor(private service: SharedUsedService,
              private dialog: MatDialog) {
  }

  subscriptions: Subscription[] = [];
  backClicked = output();

  cardsOneScreen: GuideCardModel[] = [
    {
      src: 'https://insurance-api.mydigipay.com/api/cdn/cfs/ins-resources/uploads/claim/claiming-documents/cmd-madareke-dadsara/6001b6da-4509-41f8-ba5b-bf073942e813.webp',
      text: 'تصویر پشت گوشی'
    },
    {
      src: 'https://insurance-api.mydigipay.com/api/cdn/cfs/ins-resources/uploads/claim/claiming-documents/cmd-madareke-dadsara/92b59554-7b2c-4a82-93c7-f62d9942cb79.webp',
      text: 'تصویر صفحه نمایش همراه با IMEI'
    }
  ];

  cardsTwoScreen: GuideCardModel[] = [
    {
      src: 'https://insurance-api.mydigipay.com/api/cdn/cfs/ins-resources/uploads/claim/claiming-documents/cmd-madareke-dadsara/3b6beec8-ac00-40c3-8866-b9f49a62ac8c.webp',
      text: 'تصویر صفحه نمایش اول همراه با IMEI'
    },
    {
      src: 'https://insurance-api.mydigipay.com/api/cdn/cfs/ins-resources/uploads/claim/claiming-documents/cmd-madareke-dadsara/201a742d-986e-4c37-9947-cec8a3441ad1.webp',
      text: 'تصویر صفحه نمایش دوم'
    },
    {
      src: 'https://insurance-api.mydigipay.com/api/cdn/cfs/ins-resources/uploads/claim/claiming-documents/cmd-madareke-dadsara/ee5dbec2-360e-46d0-9390-b45d3d985a06.webp',
      text: 'تصویر پشت گوشی'
    }
  ];

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: true,
      headerTitle: 'راهنمای تصویری',
    });
  }

  ngOnInit(): void {
    this.subscribeToBackClick();
    this.setHeaderData();
  }

  subscribeToBackClick(): void {
    const subscription = this.service.getBackClick()
      .subscribe(() => {
        this.backClicked.emit();
      });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
