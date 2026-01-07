import { Component, Input } from '@angular/core';
import { ruleSections } from '../nobitex-calculator/nobitex-calculator.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-nobitex-rules',
  templateUrl: './nobitex-rules.component.html',
  styleUrls: ['./nobitex-rules.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf],
})
export class NobitexRulesComponent {
  @Input() ruleSections: ruleSections[];
}
