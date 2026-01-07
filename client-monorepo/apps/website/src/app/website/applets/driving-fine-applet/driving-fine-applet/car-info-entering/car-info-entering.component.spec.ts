import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInfoEnteringComponent } from './car-info-entering.component';

describe('CarInfoEnteringComponent', () => {
  let component: CarInfoEnteringComponent;
  let fixture: ComponentFixture<CarInfoEnteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarInfoEnteringComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarInfoEnteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
