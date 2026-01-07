import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorInfoFormComponent } from './motor-info-form.component';

describe('MotorInfoFormComponent', () => {
  let component: MotorInfoFormComponent;
  let fixture: ComponentFixture<MotorInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotorInfoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotorInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
