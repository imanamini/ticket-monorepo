import { Component, OnInit } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ScreenSizeEnum } from '../../../../../enums/screen-size.enum';
import { LayoutService } from '../../../../../../../data-access/services/layout.service';

@Component({
  selector: 'app-unbundled-footer',
  templateUrl: './unbundled-footer.component.html',
  styleUrls: ['./unbundled-footer.component.scss'],
  standalone: true,
  imports: [NgIf, NgTemplateOutlet]
})
export class UnbundledFooterComponent implements OnInit {

  size: ScreenSizeEnum;

  constructor(
    private layoutService: LayoutService
  ) {
  }

  ngOnInit(): void {
    this.layoutService.screenSizeChanged.subscribe(res => {
      this.size = res;
    });
  }

}
