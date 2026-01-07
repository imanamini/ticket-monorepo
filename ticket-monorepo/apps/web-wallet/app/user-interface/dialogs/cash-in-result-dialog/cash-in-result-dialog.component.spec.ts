import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInResultDialogComponent } from './cash-in-result-dialog.component';
import { WalletModule } from '../../../wallet/wallet.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const SAMPLE_TRACKING_CODE = 'ABCDEFGH';
const SAMPLE_TEXT = 'LOREM_IPSUM_TEXT';

describe('CashInResultDialogComponent', () => {
  let component: CashInResultDialogComponent;
  let fixture: ComponentFixture<CashInResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        WalletModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            successful: true,
            trackingCode: SAMPLE_TRACKING_CODE,
            text: SAMPLE_TEXT,
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashInResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Component creation', () => {
    expect(component).toBeTruthy();
  });

  it('Title of the successful cash-in', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.dialog-title').textContent).toContain('عملیات موفق');
  });

  it('Icon of the successful cash-in', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.is-success')).toBeTruthy();
    expect(compiled.querySelector('.is-failed')).toBeNull();
  });

  it('Shows tracking code in the dialog', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.tracking-code .code').textContent).toContain(SAMPLE_TRACKING_CODE);
  });

  it('Shows texts', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.result-text').textContent).toContain(SAMPLE_TEXT);
  });

  it('Title of the unsuccessful cash-in ', () => {
    fixture = TestBed.createComponent(CashInResultDialogComponent);
    component = fixture.componentInstance;
    component.dialogData.successful = false;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.dialog-title').textContent).toContain('ناموفق');
  });

  it('Icon of the unsuccessful cash-in', () => {
    fixture = TestBed.createComponent(CashInResultDialogComponent);
    component = fixture.componentInstance;
    component.dialogData.successful = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.is-failed')).toBeTruthy();
    expect(compiled.querySelector('.is-success')).toBeNull();
  });
});
