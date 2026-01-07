import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiVehicleSimplePlateComponent } from './ui-vehicle-simple-plate.component';

describe('UiVehicleSimplePlateComponent', () => {
  let component: UiVehicleSimplePlateComponent;
  let fixture: ComponentFixture<UiVehicleSimplePlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiVehicleSimplePlateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiVehicleSimplePlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
