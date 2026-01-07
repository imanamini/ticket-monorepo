import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'common-ui-components-defer-place-holder',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, NgxSkeletonLoadingComponent],
  templateUrl: './defer-place-holder.component.html',
  styleUrl: './defer-place-holder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeferPlaceHolderComponent implements OnDestroy, OnInit {
  mode = input<'loading' | 'placeholder'>('placeholder');
  height = input('300px');
  backgroundClass = input<'surface-glass-onelevated' | 'surface-glass-onback'>('surface-glass-onback');
  loadEvent = output();
  unloadEvent = output();

  ngOnInit(): void {
    this.loadEvent.emit();
  }

  ngOnDestroy(): void {
    this.unloadEvent.emit();
  }
}
