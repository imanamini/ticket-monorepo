import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiVehiclePlateLettersComponent } from './ui-vehicle-plate-letters.component';

describe('UiVehiclePlateLettersComponent', () => {
  let component: UiVehiclePlateLettersComponent;
  let fixture: ComponentFixture<UiVehiclePlateLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiVehiclePlateLettersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiVehiclePlateLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
