import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'wallet-mng-applet-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgStyle],
})
export class SkeletonComponent {
  @Input()
  count = 1;
  @Input()
  skeletonStyle!: Object;
}
