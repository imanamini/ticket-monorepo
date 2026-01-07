import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingElementAlertBoxExtendedComponent } from './landing-element-alert-box-extended.component';

describe('LandingElementAlertBoxExtendedComponent', () => {
  let component: LandingElementAlertBoxExtendedComponent;
  let fixture: ComponentFixture<LandingElementAlertBoxExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingElementAlertBoxExtendedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingElementAlertBoxExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
