import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-credit-checkbox',
  templateUrl: './credit-checkbox.component.html',
  styleUrls: ['./credit-checkbox.component.scss']
})
export class CreditCheckboxComponent implements OnInit {

  @Input() id: any;

  @Input() type: 'primary' | 'success' = 'primary';

  @Input() disabled: boolean = false;

  @Input() checked: boolean = false;

  @Input() isLocked: boolean = false;

  @Output() checkedChange = new EventEmitter();

  @Output() lockedClick = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  handleClick(event: any) {
    if (this.isLocked) {
      event.preventDefault();
      this.lockedClick.emit();
    }
  };

  handleChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.checkedChange.emit(this.checked);
    }
  }
}
