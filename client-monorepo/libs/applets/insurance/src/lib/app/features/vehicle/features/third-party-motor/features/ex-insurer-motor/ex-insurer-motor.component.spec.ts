import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExInsurerMotorComponent } from './ex-insurer-motor.component';

describe('ExInsurerMotorComponent', () => {
  let component: ExInsurerMotorComponent;
  let fixture: ComponentFixture<ExInsurerMotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExInsurerMotorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExInsurerMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
