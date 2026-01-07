import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeadModel } from '../../../../../api/models/lead/lead.model';

@Injectable()
export class UnbundledService {
  lead: BehaviorSubject<LeadModel> = new BehaviorSubject(null);
}
