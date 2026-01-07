import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-checkbox',
  templateUrl: './credit-checkbox.component.html',
  styleUrls: ['./credit-checkbox.component.scss'],
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCheckboxComponent {
  id = input<any>();

  type = input<'primary' | 'success'>('primary');

  disabled = input(false);

  checked = model(false);

  isLocked = input(false);

  checkedChange = output<boolean>();

  lockedClick = output<void>();

  handleClick(event: any) {
    if (this.isLocked()) {
      event.preventDefault();
      this.lockedClick.emit();
    }
  }

  handleChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.checkedChange.emit(this.checked());
    }
  }
}
