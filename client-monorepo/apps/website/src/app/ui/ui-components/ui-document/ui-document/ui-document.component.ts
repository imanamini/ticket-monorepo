import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-document',
  templateUrl: './ui-document.component.html',
  styleUrls: ['./ui-document.component.scss'],
  standalone: true,
})
export class UiDocumentComponent {
  @Input()
  url: string | undefined;
  @Input()
  email: string | undefined;
}
