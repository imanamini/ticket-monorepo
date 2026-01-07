import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingFineProductComponent } from './driving-fine-product.component';

describe('CarFineProductComponent', () => {
  let component: DrivingFineProductComponent;
  let fixture: ComponentFixture<DrivingFineProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrivingFineProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrivingFineProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
