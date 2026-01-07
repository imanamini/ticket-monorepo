import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxButtonComponent} from "@digipay/ngx-button";
import {benefit} from "../../../../../../../api/clients/models/templates/c-bnpl-v2/CBnplV2Template";
import {UrlService} from "../../../../../../services/url.service";
import {DeviceDetectorService} from "../../../../../../../core/services/device/deviceDetector.service";

@Component({
    selector: 'app-bnpl-benefits',
    standalone: true,
    imports: [CommonModule, NgxButtonComponent],
    templateUrl: './bnpl-benefits.component.html',
    styleUrl: './bnpl-benefits.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplBenefitsComponent {

    protected deviceDetector = inject(DeviceDetectorService);
    private urlService = inject(UrlService);
    benefit = input<benefit>();

    openLink(link: string) {
        this.urlService.handleLink(link);
    }
}
