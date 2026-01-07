import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BundleCategory } from '../../data-access/models/internet-purchase.response';
import { NgForOf } from '@angular/common';
import { InternetCardComponent } from '../internet-card/internet-card.component';

@Component({
  selector: 'internet-applet-package',
  templateUrl: './internet-package.component.html',
  styleUrls: ['./internet-package.component.scss'],
  standalone: true,
  imports: [NgForOf, InternetCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternetPackageComponent {
  package = input<BundleCategory[]>([]);
}
