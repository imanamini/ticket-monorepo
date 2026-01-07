import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'floki-layout',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './floki-layout.component.html',
  styleUrl: './floki-layout.component.scss'
})
export class FlokiLayoutComponent {

}
