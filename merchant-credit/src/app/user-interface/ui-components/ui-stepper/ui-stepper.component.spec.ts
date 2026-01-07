import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiStepperComponent } from './ui-stepper.component';

describe('UiStepperComponent', () => {
  let component: UiStepperComponent;
  let fixture: ComponentFixture<UiStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
