import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '../../bnpl/ui-components/main-layout/main-layout.component';

@Component({
  selector: 'app-bnpl-pay-root',
  standalone: true,
  template: '<app-main-layout><router-outlet /></app-main-layout>',
  imports: [MainLayoutComponent, RouterOutlet]
})
export class BnplPayRootComponent {
}
