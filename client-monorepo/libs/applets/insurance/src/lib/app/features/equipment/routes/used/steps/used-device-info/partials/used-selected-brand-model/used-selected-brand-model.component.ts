import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'used-selected-brand-model',
  templateUrl: './used-selected-brand-model.component.html',
  standalone: true,
  styleUrls: ['./used-selected-brand-model.component.scss']
})
export class UsedSelectedBrandModelComponent implements OnInit {

  constructor() {
  }

  @HostBinding('style.width') width = '100%';

  @Input()
  title: string;

  @Input()
  subTitle: string;

  ngOnInit(): void {
  }

}
