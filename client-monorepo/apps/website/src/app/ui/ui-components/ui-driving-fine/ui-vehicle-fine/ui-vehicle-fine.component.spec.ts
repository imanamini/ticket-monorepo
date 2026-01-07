import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiVehicleFineComponent } from './ui-vehicle-fine.component';

describe('UiVehicleFineComponent', () => {
  let component: UiVehicleFineComponent;
  let fixture: ComponentFixture<UiVehicleFineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiVehicleFineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiVehicleFineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
