import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollateralWaitingResultComponent } from './collateral-waiting-result.component';

describe('CollateralWaitingResultComponent', () => {
  let component: CollateralWaitingResultComponent;
  let fixture: ComponentFixture<CollateralWaitingResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralWaitingResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollateralWaitingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
