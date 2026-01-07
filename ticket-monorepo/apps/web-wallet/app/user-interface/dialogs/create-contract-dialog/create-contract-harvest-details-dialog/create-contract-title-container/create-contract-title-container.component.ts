import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-create-contract-title-container',
  templateUrl: './create-contract-title-container.component.html',
  styleUrls: ['./create-contract-title-container.component.scss']
})
export class CreateContractTitleContainerComponent {
  @Input()
  title: string;

  @Input()
  description: string;
}
