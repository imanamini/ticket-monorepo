import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TopUpAppletComponent } from '../../../applets/top-up-applet/top-up-applet/top-up-applet.component';

@Component({
  selector: 'app-top-up-product',
  templateUrl: './top-up-product.component.html',
  styleUrls: ['./top-up-product.component.scss'],
  standalone: true,
  imports: [TopUpAppletComponent, NgFor, NgIf],
})
export class TopUpProductComponent {
  @Input()
  data: any;
}
