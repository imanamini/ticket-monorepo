import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillBillsComponent } from './bill-bills.component';

describe('BillBillsComponent', () => {
  let component: BillBillsComponent;
  let fixture: ComponentFixture<BillBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillBillsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
