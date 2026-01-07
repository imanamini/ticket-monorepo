import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  DocumentItem, documentsLegal, documentsNatural,
  LimitationDocuments,
  limitationDocumentsDataLegal,
  limitationDocumentsDataNatural,
} from 'src/app/api/models/registration/pages/limitation/limitation.model';
import {  MatDialog } from '@angular/material/dialog';
import { EstimationOfLimitationDialogComponent } from '../estimation-of-limitation-dialog/estimation-of-limitation-dialog.component';
import { RegistrationApiService } from '../../../../api/clients/registration/registration-api.service';
import { MERCHANT_TYPE } from '../../../../api/clients/registration/basic-models/merchant.type';
import { MessageService } from '../../../../core/message.service';

@Component({
  selector: 'app-limitation',
  templateUrl: './limitation.component.html',
  styleUrls: ['./limitation.component.scss']
})
export class LimitationComponent implements OnInit, OnChanges {
  @Input()
  type: MERCHANT_TYPE = 0;

  @Input()
  creditId: string = '';

  @Input()
  registrationMaxAmount: number = 0;

  @Output()
  reloadData = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  data: LimitationDocuments[] = [];
  requiredDocuments: string[] = [];
  allDocument: DocumentItem[] = [];
  isLoading: boolean = false;

  baseTitle = 'سقف اعتبار موردنیاز شما چقدر است؟';
  boxTitle = 'مدارک موردنیاز برای تسویه زودتر از موعد با سقف اعتبار ۲ میلیارد ریال';
  address = 'تهران، بلوار نلسون ماندلا، بلوار صبا غربی، پلاک ۲، طبقه ۳';
  calculatorButtonTitle = 'نمی‌دانید با مدارک خود، چقدر سقف اعتبار می‌توانید دریافت کنید؟ کلیک کنید';

  creditAmountRange: { min: number, max: number } = {min: 0, max: 0};
  selectedAmount: number = 0;
  slideStep: number = 1000000;
  errorMode?: 'not-in-range';

  constructor(
    private registrationApiService: RegistrationApiService,
    public dialog: MatDialog,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type) {
      this.data = this.type === MERCHANT_TYPE.INDIVIDUAL ? limitationDocumentsDataNatural : limitationDocumentsDataLegal;
      this.allDocument = this.type === MERCHANT_TYPE.INDIVIDUAL ? documentsNatural : documentsLegal;
      this.setAmountSliderInfo();
    }
  }

  private setAmountSliderInfo() {
    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;
    this.data.forEach(item => {
      min = item.range.from < min ? item.range.from : min;
      max = item.range.to > max ? item.range.to : max;
    });
    if (this.registrationMaxAmount < min) {
      this.errorMode = 'not-in-range';
      return;
    }
    if (this.registrationMaxAmount < max) {
      max = this.registrationMaxAmount;
    }
    this.creditAmountRange = {min, max};
    this.selectedAmount = max;
    this.slideStep = this.getSlideStep();
    this.setDocuments();
  }

  setDocuments(): void {
    const inRange = this.data.find(item => {
      return item.range.from <= this.selectedAmount && item.range.to >= this.selectedAmount;
    });
    if (inRange) {
      this.requiredDocuments = inRange.documents;
    } else {
      this.requiredDocuments = [];
    }
  }

  openEstimationDialog() {
    this.dialog.open(EstimationOfLimitationDialogComponent, {
      width: '700px',
      maxWidth: '90%',
      direction: 'rtl',
      data: {
        documents: this.allDocument,
        data: this.data,
        registrationMaxAmount: this.registrationMaxAmount
      }
    }).afterClosed().subscribe(result => {
      if (result && result > 0) {
        this.selectedAmount = result;
      }
    });

  }

  onSubmit() {
    this.registrationApiService.reviseMaxAmount(this.creditId, this.selectedAmount).subscribe(() => {
      this.reloadData.emit();
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
  }

  private getSlideStep():number {
    const maxBreakPointToStepMapper: { breakPoint: number, step: number }[] = [
      {breakPoint: 100000000, step: 10000000},
      {breakPoint: 500000000, step: 50000000},
      {breakPoint: 1000000000, step: 100000000},
      {breakPoint: 5000000000, step: 500000000},
    ];
    const mapItem = maxBreakPointToStepMapper.find(item => {
      return this.creditAmountRange.max <= item.breakPoint;
    });
    return mapItem ? mapItem.step : 500000000;
  }
}
