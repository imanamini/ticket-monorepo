import { Component } from '@angular/core';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-report2021',
  templateUrl: './report2021.component.html',
  styleUrls: ['./report2021.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent],
})
export class Report2021Component {
  scrollToElement($element: any): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}
