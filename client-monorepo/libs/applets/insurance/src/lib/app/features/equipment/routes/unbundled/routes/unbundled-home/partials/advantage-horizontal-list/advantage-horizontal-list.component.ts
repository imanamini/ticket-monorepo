import { Component, OnInit } from '@angular/core';
import { SWIPER_ITEM_DATA } from './swiper-item-data';
import { DecimalPipe, NgForOf } from '@angular/common';
import {
  NewSwiperComponent
} from '../../../../../../../../components/new-swiper/new-swiper/new-swiper.component';
import { ListDirective } from '../../../../../../../../components/new-swiper/directive/list.directive';

interface SwiperItemModel {
  iconName: string;
  title: string;
  description: string;
}

@Component({
  selector: 'advantage-horizontal-list',
  templateUrl: './advantage-horizontal-list.component.html',
  styleUrls: ['./advantage-horizontal-list.component.scss'],
  imports: [
    NgForOf,
    DecimalPipe,
    NewSwiperComponent,
    ListDirective
  ],
  standalone: true
})
export class AdvantageHorizontalListComponent implements OnInit {

  swiperList: SwiperItemModel[] = SWIPER_ITEM_DATA.buyList;

  selectedList = 'buy-policy';

  buttonGroup = [
    {
      id: 'buy-policy',
      message: 'فرایند خرید بیمه'
    },
    {
      id: 'declare-claim',
      message: 'نحوه اعلام خسارت'
    },
    {
      id: 'transfer',
      message: 'نحوه انتقال مالکیت'
    },
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  changeTab(value: string): void {
    switch (value) {
      case 'buy-policy' :
        this.swiperList = SWIPER_ITEM_DATA.buyList;
        break;
      case 'declare-claim' :
        this.swiperList = SWIPER_ITEM_DATA.declareClaimList;
        break;
      case 'transfer' :
        this.swiperList = SWIPER_ITEM_DATA.TransferList;
    }
    this.selectedList = value;
  }
}
