import { Component, Input, OnInit } from '@angular/core';
import { DocumentItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';

@Component({
  selector: 'app-opening-bank-account-info-boxes',
  templateUrl: './opening-bank-account-info-boxes.component.html',
  styleUrls: ['./opening-bank-account-info-boxes.component.scss']
})
export class OpeningBankAccountInfoBoxesComponent implements OnInit {

  @Input()
  requiredDocuments: DocumentItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
