import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ReceiptService } from '../../services/receipt.service';
import { ReceiptInterface } from '../../models/receipt.interface';
import {ActivityInfo} from "../../../../models/cash-out.model";
import {BinaryConvertor} from "../binary-code/binary-convertor";
import {Copy} from "../binary-code/copy-item";
import {NgForOf, NgIf, SlicePipe} from "@angular/common";
import {BinaryCodeComponent} from "../binary-code/binary-code.component";

@Component({
  selector: 'left-section',
  templateUrl: './left-section.component.html',
  styleUrls: ['./left-section.component.scss'],
  imports: [
    NgForOf,
    BinaryCodeComponent,
    NgIf,
    SlicePipe
  ],
  standalone: true
})
export class LeftSectionComponent implements OnInit {
  @ViewChild('copyItem', {static: false}) copyItemElement: ElementRef<HTMLElement>;
  public binary: string;
  public state: ReceiptInterface;
  private receiptService = inject(ReceiptService);

  ngOnInit() {
    this.state = this.receiptService.getState();
    //ToDo: Change this.cashOutResult.paymentResult[2].value when back end implement as single field.
    this.binary = BinaryConvertor(this.state.paymentResult[2].value);
  }

  public copyItem(info: ActivityInfo): void {
    Copy(info).then(() => {
      this.copyItemElement.nativeElement.classList.add('clicked');
      setTimeout(() => {
        this.copyItemElement.nativeElement.classList.remove('clicked');
      }, 1000);
    });
  }
}
