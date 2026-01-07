import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IHint } from '../models/security-hint.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SecurityHintsService {
  private hints = 'wealth-assets/security-hints.json';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<IHint[]> {
    return this.http.get<any>(this.hints);
  }
}
