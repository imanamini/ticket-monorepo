import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorPolicyDetailComponent } from './motor-policy-detail.component';

describe('MotorPolicyDetailComponent', () => {
  let component: MotorPolicyDetailComponent;
  let fixture: ComponentFixture<MotorPolicyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotorPolicyDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotorPolicyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
