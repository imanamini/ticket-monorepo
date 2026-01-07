import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollateralRejectedResultComponent } from './collateral-rejected-result.component';

describe('CollateralRejectedResultComponent', () => {
  let component: CollateralRejectedResultComponent;
  let fixture: ComponentFixture<CollateralRejectedResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralRejectedResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollateralRejectedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
