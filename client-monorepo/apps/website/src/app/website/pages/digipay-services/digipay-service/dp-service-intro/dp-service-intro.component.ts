import { Component, Input } from '@angular/core';
import { ServicePageTemplate } from '../../../../../api/clients/models/templates/services/service-page-template';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { PopupDownloadComponent } from '../../../../../ui/ui-components/ui-popup/popup-download/popup-download.component';
import { ServiceArtCardComponent } from '../../../../../ui/ui-components/ui-services/service-art-card/service-art-card.component';
import { ServiceArtMobileComponent } from '../../../../../ui/ui-components/ui-services/service-art-mobile/service-art-mobile.component';
import { ServiceArtCubeComponent } from '../../../../../ui/ui-components/ui-services/service-art-cube/service-art-cube.component';
import { NgClass, NgSwitch, NgSwitchCase, NgIf } from '@angular/common';

@Component({
  selector: 'app-dp-service-intro',
  templateUrl: './dp-service-intro.component.html',
  styleUrls: ['./dp-service-intro.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgSwitch,
    NgSwitchCase,
    ServiceArtCubeComponent,
    ServiceArtMobileComponent,
    ServiceArtCardComponent,
    NgIf,
    PopupDownloadComponent,
    UiButtonComponent,
  ],
})
export class DpServiceIntroComponent {
  @Input()
  templateData?: null | ServicePageTemplate;
}
