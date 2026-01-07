import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { BundleCategory } from '../../data-access/models/internet-purchase.response';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'internet-applet-badge-component',
  templateUrl: './badge-component.component.html',
  standalone: true,
  imports: [NgClass, NgForOf],
  styleUrls: ['./badge-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponentComponent implements OnInit {
  packages = input<BundleCategory[]>([]);
  selectTitle = output<string>();

  selectedItem = signal('');

  packageTitles = signal<string[]>([]);

  ngOnInit(): void {
    this.createBadgeTitle();
  }

  createBadgeTitle() {
    this.packageTitles.set(this.packages().map((item) => item.title));
    const all = 'همه';
    this.packageTitles().unshift(all);
    this.selectedItem.set(this.packageTitles()[0]);
    this.selectTitle.emit(this.packageTitles()[0]);
  }

  onClick(title: string) {
    this.selectedItem.set(title);
    this.selectTitle.emit(title);
  }
}
