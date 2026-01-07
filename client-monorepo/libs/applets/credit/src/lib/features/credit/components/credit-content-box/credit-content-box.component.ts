import { ChangeDetectionStrategy, Component, ContentChildren, input, output, QueryList } from '@angular/core';
import { ContentBoxFooterDirective } from './marks/content-box-footer.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-credit-content-box',
  templateUrl: './credit-content-box.component.html',
  standalone: true,
  imports: [NgTemplateOutlet],
  styleUrls: ['./credit-content-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditContentBoxComponent {
  contentBoxTitle = input<string>();

  showHeader = input(true);

  showLogo = input(true);

  countDown = input<number>();

  showBackButton = input(false);

  showCloseButton = input(false);

  bodyPadding = input(true);

  grayMode = input<boolean>();

  headerBorderBottom = input(true);

  fullHeight = input(false);

  backClick = output<void>();

  countDownFinished = output<void>();

  /**
   * Query for notices (errors, hints, etc.)
   */
  @ContentChildren(ContentBoxFooterDirective)
  footerItems!: QueryList<ContentBoxFooterDirective>;

  backIconClick() {
    this.backClick.emit();
  }
}
