import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmCollateralInfoComponent } from './confirm-collateral-info.component';

describe('ConfirmCollateralInfoComponent', () => {
  let component: ConfirmCollateralInfoComponent;
  let fixture: ComponentFixture<ConfirmCollateralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCollateralInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmCollateralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
