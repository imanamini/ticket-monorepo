import { Component, Input, OnInit } from '@angular/core';
import { UsedDeviceInfoService } from '../../services/used-device-info.service';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'used-brand-model-404',
  templateUrl: './used-brand-model-404.component.html',
  standalone: true,
  imports: [
    UiButtonComponent
  ],
  styleUrls: ['./used-brand-model-404.component.scss']
})
export class UsedBrandModel404Component implements OnInit {

  constructor(private deviceInfoService: UsedDeviceInfoService) {
  }

  @Input()
  isBrand: boolean;

  ngOnInit(): void {
  }

  generateTitle(): string {
    return this.isBrand ? 'برند مورد نظر یافت نشد!' : 'مدل مورد نظر یافت نشد!';
  }

  handleButtonClick(): void {
    this.deviceInfoService.setStoredDeviceInfo({
      ...this.deviceInfoService.getStoredDeviceInfo(),
      brandId: null,
      modelId: null,
    });
    this.deviceInfoService.setShowCustomBrandModel(true);
  }
}
