import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsPaginationComponent } from './jobs-pagination.component';

describe('JobsPaginationComponent', () => {
  let component: JobsPaginationComponent;
  let fixture: ComponentFixture<JobsPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
