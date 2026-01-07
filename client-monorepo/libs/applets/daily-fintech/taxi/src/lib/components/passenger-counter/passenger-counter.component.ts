import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'taxi-applet-passenger-counter',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './passenger-counter.component.html',
  styleUrl: './passenger-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassengerCounterComponent implements OnInit {
  @Input() maxPassenger!: number;
  @Input() minPassenger!: number;
  @Output() passengerNumberClicked = new EventEmitter<number>();
  countNumber!: number;

  ngOnInit() {
    this.countNumber = this.minPassenger;
  }

  increaseNumber() {
    if (this.countNumber === this.maxPassenger) {
      return;
    }
    this.countNumber += 1;
    this.passengerNumberClicked.emit(this.countNumber);
  }

  decreaseNumber() {
    if (this.countNumber === 1) {
      return;
    }
    this.countNumber -= 1;
    this.passengerNumberClicked.emit(this.countNumber);
  }
}
