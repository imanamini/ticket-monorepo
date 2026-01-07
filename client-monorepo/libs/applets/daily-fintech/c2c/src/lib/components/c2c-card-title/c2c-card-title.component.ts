import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgClass } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'c2c-applet-c2c-card-title',
  standalone: true,
  imports: [DpIconComponent, NgClass, NgxButtonComponent],
  templateUrl: './c2c-card-title.component.html',
  styleUrl: './c2c-card-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cCardTitleComponent {
  //inputs
  titleText = input('');
  buttonText = input('');
  subTitleText = input('');
  buttonIconName = input('');
  mode = input<'inactive' | 'active'>('active');
  hasLeftLine = input(false);
  infoText = input('');

  //computed signals
  hasButton = computed(() => {
    return this.buttonText()?.length > 0;
  });
  hasSubTitle = computed(() => {
    return this.subTitleText()?.length > 0;
  });
  hasInfo = computed(() => {
    return this.infoText()?.length > 0;
  });
  titleClass = computed(() => {
    return this.mode() === 'inactive' ? 'text-onback-disabled' : 'text-onback-medium';
  });

  subtitleClass = computed(() => {
    return this.mode() === 'inactive' ? 'text-onback-disabled' : 'text-onback-low';
  });

  //outputs
  actionClicked = output<void>();

  onActionClicked() {
    this.actionClicked.emit();
  }
}
