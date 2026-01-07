import { inject, Injectable } from '@angular/core';
import { RegistrationApiService } from '../../../../../../../api/clients/registration/registration-api.service';
import { MERCHANT_TYPE } from '../../../../../../../api/clients/registration/basic-models/merchant.type';
import {
  DocumentForBranchesItems,
  DocumentItems, samanDocumentForBranchesLegal, samanDocumentForBranchIndividual,
  samanDocumentIndividual, samanDocumentLegal
} from '../../../../../../../api/models/registration-v3/registration-v3.model';
import { TicketService } from '../../../../../../../core/ticket.service';

@Injectable({
  providedIn: 'root'
})
export class EsLoanSamanService {

  stepsState: any;
  detailState: any;

  registrationApiService = inject(RegistrationApiService);
  ticketService = inject(TicketService);

  getSamanDocuments(type: MERCHANT_TYPE): DocumentItems[] {
    return type === MERCHANT_TYPE.INDIVIDUAL ? samanDocumentIndividual : samanDocumentLegal;
  }

  getSamanDocumentsForBranches(type: MERCHANT_TYPE): DocumentForBranchesItems[] {
    return type === MERCHANT_TYPE.INDIVIDUAL ? samanDocumentForBranchIndividual : samanDocumentForBranchesLegal;
  }

  getSteps(creditId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.registrationApiService.getSteps(creditId)
        .subscribe(stepsResponse => {
            this.stepsState = stepsResponse;
            resolve(stepsResponse);
          },
          (error) => {
            reject(error);
          });
    });
  }

  getDetails(creditId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ticketService.getTicketDetail(creditId, true)
        .subscribe(ticketDetail => {
            this.detailState = ticketDetail;
            resolve(ticketDetail);
          },
          (error) => {
            reject(error);
          });
    });
  }

}
