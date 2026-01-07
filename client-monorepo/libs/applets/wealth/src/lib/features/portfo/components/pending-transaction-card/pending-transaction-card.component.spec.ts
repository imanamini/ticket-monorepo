import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingTransactionCardComponent } from './pending-transaction-card.component';

describe('PendingTransactionCardComponent', () => {
  let component: PendingTransactionCardComponent;
  let fixture: ComponentFixture<PendingTransactionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingTransactionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingTransactionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
