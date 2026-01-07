import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-credit-provision',
  templateUrl: './credit-provision.component.html',
  styleUrls: ['./credit-provision.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProvisionComponent {
  clicked = output<void>();

  text = input('');

  click() {
    this.clicked.emit();
  }
}
