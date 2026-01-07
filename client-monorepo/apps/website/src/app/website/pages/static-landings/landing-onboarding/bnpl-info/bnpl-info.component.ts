import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {textIntro} from "../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";

@Component({
  selector: 'app-bnpl-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bnpl-info.component.html',
  styleUrl: './bnpl-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplInfoComponent {

  textIntro = input<textIntro>();

}
