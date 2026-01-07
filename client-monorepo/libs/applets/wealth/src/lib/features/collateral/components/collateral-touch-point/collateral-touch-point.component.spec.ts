import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollateralTouchPointComponent } from './collateral-touch-point.component';

describe('CollateralTouchPointComponent', () => {
  let component: CollateralTouchPointComponent;
  let fixture: ComponentFixture<CollateralTouchPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollateralTouchPointComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollateralTouchPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
