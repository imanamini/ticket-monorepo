import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepRecordVideoComponent } from './step-record-video.component';

describe('StepRecordVideoComponent', () => {
  let component: StepRecordVideoComponent;
  let fixture: ComponentFixture<StepRecordVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepRecordVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepRecordVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
