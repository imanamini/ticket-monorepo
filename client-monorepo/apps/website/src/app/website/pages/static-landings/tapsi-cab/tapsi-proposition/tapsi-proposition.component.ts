import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TapsiCabTemplateData} from "../../../../../api/clients/models/templates/tapsi-cab/tapsi-cab-template-data";

@Component({
  selector: 'app-tapsi-proposition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tapsi-proposition.component.html',
  styleUrl: './tapsi-proposition.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsiPropositionComponent {

  templateData = input<TapsiCabTemplateData | null>(null);
}
