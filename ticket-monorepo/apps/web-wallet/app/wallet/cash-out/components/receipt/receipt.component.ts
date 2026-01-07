import { Component } from '@angular/core';
import {RightSectionComponent} from "./components/right-section/right-section.component";
import {LeftSectionComponent} from "./components/left-section/left-section.component";

@Component({
  selector: 'receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  imports: [
    RightSectionComponent,
    LeftSectionComponent
  ],
  standalone: true
})
export class ReceiptComponent {

}
