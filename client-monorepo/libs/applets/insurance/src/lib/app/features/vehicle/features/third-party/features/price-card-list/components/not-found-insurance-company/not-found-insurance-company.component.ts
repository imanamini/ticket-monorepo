import { Component, input } from '@angular/core';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';

type BackgroundColor = 'white' | 'gray';

@Component({
  selector: 'not-found-insurance-company',
  standalone: true,
  imports: [
    InsIconComponent
  ],
  templateUrl: './not-found-insurance-company.component.html',
  styleUrl: './not-found-insurance-company.component.scss'
})
export class NotFoundInsuranceCompanyComponent {
  backgroundColor = input.required<BackgroundColor>({alias: 'background-color'});
  protected readonly IconEnum = IconEnum;
}
