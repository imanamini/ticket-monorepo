import { Component, EventEmitter, Output } from '@angular/core';
import { UiVehiclePlateLetterComponent } from '../ui-vehicle-plate-letter/ui-vehicle-plate-letter.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-vehicle-plate-letters',
  templateUrl: './ui-vehicle-plate-letters.component.html',
  styleUrls: ['./ui-vehicle-plate-letters.component.scss'],
  standalone: true,
  imports: [NgFor, UiVehiclePlateLetterComponent],
})
export class UiVehiclePlateLettersComponent {
  plateIndexes = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '10',
    '13',
    '15',
    '16',
    '17',
    '19',
    '21',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '54',
    '69',
  ];

  @Output()
  clicked = new EventEmitter();

  listItemClick(value: any): void {
    this.clicked.emit(value);
  }
}
