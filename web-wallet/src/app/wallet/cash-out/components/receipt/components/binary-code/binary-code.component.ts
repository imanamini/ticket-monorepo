import { Component, Input, OnInit } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-binary-loop',
  standalone: true,
  template: `
    <div class="binary-transaction">
      <div *ngFor="let digit of binaryArray" [ngClass]="digit === '0' ? 'zero' : 'one'"></div>
    </div>
  `,
  imports: [
    NgClass,
    NgForOf
  ],
  styles: [`
    .binary-transaction {
      direction: ltr;
      max-width: 100%;
      flex-wrap: wrap;
      display: flex;
      gap: 5px;
    }

    .zero {
      position: relative;
      width: 5px;
      height: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .zero::before,
    .zero::after {
      content: "";
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
    }

    .zero::before {
      top: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #DEE3E7;
      opacity: 0.5;
    }

    .zero::after {
      bottom: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #AFB9C5;
      opacity: 0.5;
    }

    .one {
      width: 5px;
      height: 15px;
      border-radius: 16px;
      background-color: #AFB9C5;
      opacity: 0.5;
    }
  `]
})
export class BinaryCodeComponent implements OnInit {
  @Input() binary = '';
  binaryArray: string[] = [];

  ngOnInit() {
    this.binaryArray = this.binary.split('');
  }
}
