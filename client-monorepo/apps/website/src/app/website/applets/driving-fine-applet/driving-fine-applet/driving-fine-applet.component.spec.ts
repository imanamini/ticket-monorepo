import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingFineAppletComponent } from './driving-fine-applet.component';

describe('DrivingFineAppletComponent', () => {
  let component: DrivingFineAppletComponent;
  let fixture: ComponentFixture<DrivingFineAppletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrivingFineAppletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrivingFineAppletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
