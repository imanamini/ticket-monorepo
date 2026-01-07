import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-credit-generate-digital-signature-info-character-selection-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './credit-generate-digital-signature-info-character-selection-bottom-sheet.component.html',
  styleUrl: './credit-generate-digital-signature-info-character-selection-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureInfoCharacterSelectionBottomSheetComponent implements OnInit {
  characters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  selectedItem = signal<string | undefined>(undefined);

  private bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.selectedItem.set(this.bottomSheetService.data().character);
  }

  onSelectChar(character: string) {
    this.selectedItem.set(character);
    this.bottomSheetService.outputData.set(character);
    this.bottomSheetService.closeBottomSheet();
  }
}
