import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,  MatDialogRef } from '@angular/material/dialog';
import { DocumentItem, LimitationDocuments } from '../../../../api/models/registration/pages/limitation/limitation.model';
import { numberToString } from '../../../../utils/number-to-string';

@Component({
  selector: 'app-estimation-of-limitation-dialog',
  templateUrl: './estimation-of-limitation-dialog.component.html',
  styleUrls: ['./estimation-of-limitation-dialog.component.scss']
})
export class EstimationOfLimitationDialogComponent implements OnInit {
  data: LimitationDocuments[];
  documents: DocumentItem[];
  selectedDocuments: {[key: string]: boolean};
  minimumDocuments: string[];
  registrationMaxAmount: number = 0;
  maxAmount = 0;
  maxAmountString: string = '';
  tempMaxAmount = 0;

  constructor(
    public dialogRef: MatDialogRef<EstimationOfLimitationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      data: LimitationDocuments[],
      documents: DocumentItem[],
      registrationMaxAmount: number;
    }
  ) {
    this.data = dialogData.data;
    this.registrationMaxAmount = dialogData.registrationMaxAmount;
    let inRangeDoc: string[] = [];
    this.data.forEach(item => {
      if (item.range.from <= this.registrationMaxAmount) {
        inRangeDoc = inRangeDoc.concat(item.documents);
      }
    });
    this.documents = [];
    dialogData.documents.forEach(doc => {
      if (inRangeDoc.indexOf(doc.id) !== -1) {
        this.documents.push(doc);
      }
    });
    this.selectedDocuments = {};
    this.documents.forEach(item => {
      this.selectedDocuments[item.id] = true;
    });
    this.minimumDocuments = this.getMinimumDocsFromData(this.data);
    this.calculateMaxAmount();
    this.tempMaxAmount = this.maxAmount;
  }

  ngOnInit(): void {
  }

  calculateMaxAmount(): void {
    let maxAmount = 0;
    this.data.forEach(item => {
      if( item.documents.every(docId => this.selectedDocuments[docId]) && item.range.to > maxAmount){
        maxAmount = item.range.to;
      }
    });
    this.maxAmount = maxAmount > this.registrationMaxAmount ? this.registrationMaxAmount : maxAmount;
    this.maxAmountString = numberToString(this.maxAmount);
    this.runAmountAnimation();
  }

  selectAmount() {
    this.dialogRef.close(this.maxAmount);
  }

  getMinimumDocsFromData(data: LimitationDocuments[]): string[] {
    const docIdsList: string[][] = data.map(item => item.documents);
    if (!docIdsList) {
      return [];
    }
    return docIdsList[0].filter(function(v) {
      return docIdsList.every(function(a) {
        return a.indexOf(v) !== -1;
      });
    });
  }

  private runAmountAnimation() {
    const step = 100000000;
    const diff = Math.abs(this.tempMaxAmount - this.maxAmount);
    if (diff <= step) {
      this.tempMaxAmount = this.maxAmount;
      return;
    }
    if (this.tempMaxAmount > this.maxAmount) {
      this.tempMaxAmount -= step;
    }
    if (this.tempMaxAmount < this.maxAmount) {
      this.tempMaxAmount += step;
    }
    setTimeout(() => {
      this.runAmountAnimation();
    }, 20 / (diff / step))
  }
}
