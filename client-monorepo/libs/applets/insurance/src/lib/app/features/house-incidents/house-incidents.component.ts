import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'house-incidents',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './house-incidents.component.html',
  styleUrl: './house-incidents.component.scss'
})
export class HouseIncidentsComponent {

}
