import { Component, Input } from '@angular/core';
import { StepsSection } from '../merchant-register-response';

@Component({
  selector: 'app-sells-steps',
  templateUrl: './sells-steps.component.html',
  standalone: true,
  styleUrls: ['./sells-steps.component.scss'],
})
export class SellsStepsComponent {
  @Input()
  stepsSection!: StepsSection;
}
