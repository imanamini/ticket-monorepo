import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollateralApprovedResultComponent } from './collateral-approved-result.component';

describe('CollateralApprovedResultComponent', () => {
  let component: CollateralApprovedResultComponent;
  let fixture: ComponentFixture<CollateralApprovedResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralApprovedResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollateralApprovedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
