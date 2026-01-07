import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-vehicle-plate-letter',
  templateUrl: './ui-vehicle-plate-letter.component.html',
  styleUrls: ['./ui-vehicle-plate-letter.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class UiVehiclePlateLetterComponent {
  @Input()
  letterNo: string;

  @Input()
  invertColor = true;
}
