import { AfterViewInit, Component, Input } from '@angular/core';

import { delay, of } from 'rxjs';
import { HeroSection } from '../merchant-register-response';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { ScrollToAnchorDirective } from '../../../../../ui/ui-directive/scroll-to-anchor.directive';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-intro-section',
  templateUrl: './intro-section.component.html',
  standalone: true,
  styleUrls: ['./intro-section.component.scss'],
  imports: [UiButtonComponent, ScrollToAnchorDirective, UiIconDirective],
})
export class IntroSectionComponent implements AfterViewInit {
  @Input()
  heroSection!: HeroSection;
  @Input() scrollAnchor = 'merchant-form';

  dailyVisit = 0;
  dailyVisitTarget = 60;
  userCount = 0;
  userCountTarget = 3;
  loanCount = 0;
  loanCountTarget = 7;

  timeCount = 0;
  timeCountTarget = 24;

  ngAfterViewInit(): void {
    of('')
      .pipe(delay(2000))
      .subscribe({
        next: () => {
          this.animateCount('dailyVisit', this.dailyVisitTarget);
          this.animateCount('userCount', this.userCountTarget);
          this.animateCount('loanCount', this.loanCountTarget);
          this.animateCount('timeCount', this.timeCountTarget);
        },
      });
  }

  scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ block: 'center', inline: 'center' });
    }
  }

  animateCount(property: string, target: number): void {
    let current = 0;
    const step = Math.ceil(target / 100);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      (this as any)[property] = current;
    }, 20);
  }
}
