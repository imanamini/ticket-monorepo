import { Component, output } from '@angular/core';
import { GuideCardModel } from '../../../../../equipment/routes/used/steps/used-upload-file/model/guide-card.model';
import {
  GuideCardComponent
} from '../../../../../equipment/routes/used/steps/used-upload-file/partial/guide-card/guide-card.component';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { MainHeaderComponent } from '../../../../../../components/main-header/main-header.component';

@Component({
  selector: 'sample-images',
  standalone: true,
  imports: [
    GuideCardComponent,
    MainHeaderComponent
  ],
  templateUrl: './sample-images.component.html',
  styleUrl: './sample-images.component.scss'
})
export class SampleImagesComponent extends BaseComponent {

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
}
