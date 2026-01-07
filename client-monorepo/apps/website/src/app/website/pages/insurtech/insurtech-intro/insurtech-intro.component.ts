import { Component, input } from '@angular/core';
import { InsurtechTemplateData } from '../../../../api/clients/models/templates/insurtech/insurtech-template-data';

@Component({
  selector: 'app-insurtech-intro',
  templateUrl: './insurtech-intro.component.html',
  styleUrls: ['./insurtech-intro.component.scss'],
  standalone: true,
})
export class InsurtechIntroComponent {
  templateData = input<InsurtechTemplateData | null>(null);
}
