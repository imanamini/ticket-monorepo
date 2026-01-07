import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiVehiclePlateLetterComponent } from './ui-vehicle-plate-letter.component';

describe('UiVehiclePlateLetterComponent', () => {
  let component: UiVehiclePlateLetterComponent;
  let fixture: ComponentFixture<UiVehiclePlateLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiVehiclePlateLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiVehiclePlateLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
