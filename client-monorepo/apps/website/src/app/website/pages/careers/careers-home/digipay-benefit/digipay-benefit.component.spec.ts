import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DigipayBenefitComponent } from './digipay-benefit.component';

describe('DigipayBenefitComponent', () => {
  let component: DigipayBenefitComponent;
  let fixture: ComponentFixture<DigipayBenefitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigipayBenefitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DigipayBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
