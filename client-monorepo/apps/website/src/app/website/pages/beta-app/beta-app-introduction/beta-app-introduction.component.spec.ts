import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaAppIntroductionComponent } from './beta-app-introduction.component';

describe('BetaAppIntroductionComponent', () => {
  let component: BetaAppIntroductionComponent;
  let fixture: ComponentFixture<BetaAppIntroductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BetaAppIntroductionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaAppIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
