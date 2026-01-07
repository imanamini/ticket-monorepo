import { Component, Input } from '@angular/core';
import { CBnplValueProposition } from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import { NgFor, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-value-proposition',
  templateUrl: './value-proposition.component.html',
  styleUrls: ['./value-proposition.component.scss'],
  standalone: true,
  imports: [NgFor, NgOptimizedImage],
})
export class ValuePropositionComponent {
  @Input() valuePropositionData: CBnplValueProposition;
}
