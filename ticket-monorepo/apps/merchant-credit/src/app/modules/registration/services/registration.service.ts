import { Injectable } from '@angular/core';
import {
  digipayFeesLegal,
  digipayFeesNatural, digipayLimitationFeesLegal,
  digipayLimitationFeesNatural,
  DocumentItem, documentsLegal, documentsNatural, FeeItem,
  LimitationDocuments, limitationDocumentsDataLegal,
  limitationDocumentsDataNatural, MaxLimitPerFees,
} from '../../../api/models/registration/pages/limitation/limitation.model';
import { MERCHANT_TYPE } from '../../../api/clients/registration/basic-models/merchant.type';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  getDocumentData(type: MERCHANT_TYPE): LimitationDocuments[] {
    return type === MERCHANT_TYPE.INDIVIDUAL ? limitationDocumentsDataNatural : limitationDocumentsDataLegal;
  }

  getAllDocuments(type: MERCHANT_TYPE): DocumentItem[] {
    return type === MERCHANT_TYPE.INDIVIDUAL ? documentsNatural : documentsLegal;
  }

  amountToDocuments(type: MERCHANT_TYPE, maxAmount: number): DocumentItem[] {
    let requiredDocIds: string[] = [];
    const data = this.getDocumentData(type);
    const allDocuments = this.getAllDocuments(type);
    data.forEach(item => {
      if (item.range.from <= maxAmount) {
        requiredDocIds = requiredDocIds.concat(item.documents);
      }
    });
    const requiredDocuments: DocumentItem[] = [];
    allDocuments.forEach(doc => {
      if (requiredDocIds.indexOf(doc.id) !== -1) {
        requiredDocuments.push(doc);
      }
    });
    return requiredDocuments;
  }

  getMinimumDocIds(type: MERCHANT_TYPE): string[] {
    const data = this.getDocumentData(type);
    const docIdsList: string[][] = data.map(item => item.documents);
    if (!docIdsList) {
      return [];
    }
    return docIdsList[0].filter(function (v) {
      return docIdsList.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });
  }

  documentsToAmount(type: MERCHANT_TYPE, documentIds: string[]) {
    let maxAmount = 0;
    const data = this.getDocumentData(type);
    data.forEach(item => {
      if (item.documents.every(docId => documentIds.indexOf(docId) !== -1) && item.range.to > maxAmount) {
        maxAmount = item.range.to;
      }
    });
    return maxAmount;
  }

  getFeeData(type: MERCHANT_TYPE): MaxLimitPerFees[] {
    return type === MERCHANT_TYPE.INDIVIDUAL ? digipayLimitationFeesNatural : digipayLimitationFeesLegal;
  }

  getAllFees(type: MERCHANT_TYPE): FeeItem[] {
    return type === MERCHANT_TYPE.INDIVIDUAL ? digipayFeesNatural : digipayFeesLegal;
  }

  amountToFees(type: MERCHANT_TYPE, maxAmount: number): FeeItem[] {
    let requiredFeeIds: string[] = [];
    const data: MaxLimitPerFees[] = this.getFeeData(type);
    const allFees: FeeItem[] = this.getAllFees(type);
    data.forEach(item => {
      if (item.maxAmount <= maxAmount) {
        requiredFeeIds = requiredFeeIds.concat(item.fees);
      }
    });
    const requiredFees: FeeItem[] = [];
    allFees.forEach(fee => {
      if (requiredFeeIds.indexOf(fee.id) !== -1) {
        requiredFees.push(fee);
      }
    });
    return requiredFees;
  }

  FeesToAmount(type: MERCHANT_TYPE, feeIds: string[]) {
    let maxAmount = 0;
    const data = this.getFeeData(type);
    data.forEach(item => {
      if (item.fees.every(feeId => feeIds.indexOf(feeId) !== -1) && item.maxAmount > maxAmount) {
        maxAmount = item.maxAmount;
      }
    });
    return maxAmount;
  }
}
