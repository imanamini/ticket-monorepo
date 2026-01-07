import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { UiSectionFooterDirective } from '../ui-section-footer.directive';
import { UiSectionHeaderIconDirective } from '../ui-section-header-icon.directive';
import { runHeightAnimation } from '../../../../utils/height-animation';
import { NgClass, NgIf, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ui-section',
  templateUrl: './ui-section.component.html',
  styleUrls: ['./ui-section.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, NgTemplateOutlet],
})
export class UiSectionComponent {
  @Input()
  sectionTitle: string;

  @Input()
  isPageBody = false;

  @Input()
  state = 1;

  @ContentChildren(UiSectionFooterDirective)
  footerItems!: QueryList<UiSectionFooterDirective>;

  @ContentChildren(UiSectionHeaderIconDirective)
  headerIcons!: QueryList<UiSectionHeaderIconDirective>;

  bodyHeightChange(): void {
    const body = document.getElementById('ui-section-body');
    runHeightAnimation(body);
  }
}
