import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCardNumberInputComponent } from './ui-card-number-input.component';

describe('UiCardNumberInputComponent', () => {
  let component: UiCardNumberInputComponent;
  let fixture: ComponentFixture<UiCardNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiCardNumberInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCardNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
