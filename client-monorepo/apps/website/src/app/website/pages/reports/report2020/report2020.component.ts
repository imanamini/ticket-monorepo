import { Component } from '@angular/core';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-report2020',
  templateUrl: './report2020.component.html',
  styleUrls: ['./report2020.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent],
})
export class Report2020Component {
  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}
