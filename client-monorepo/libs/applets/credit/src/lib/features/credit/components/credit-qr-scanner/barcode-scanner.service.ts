import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BarcodeScannerData } from './models/barcode-scanner.model';
import { ScannedBill } from './models/scanned-bill.model';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {
  data = new BehaviorSubject<BarcodeScannerData | null>(null);
  onScan: Subject<ScannedBill> = new Subject();

  scan(data: BarcodeScannerData) {
    this.data.next(data);
  }
}
