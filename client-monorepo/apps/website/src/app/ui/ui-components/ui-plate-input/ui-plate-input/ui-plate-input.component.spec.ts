import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPlateInputComponent } from './ui-plate-input.component';

describe('UiPlateInputComponent', () => {
  let component: UiPlateInputComponent;
  let fixture: ComponentFixture<UiPlateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiPlateInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiPlateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
