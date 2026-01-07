import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersJobPageComponent } from './careers-job-page.component';

describe('CareersJobPageComponent', () => {
  let component: CareersJobPageComponent;
  let fixture: ComponentFixture<CareersJobPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareersJobPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CareersJobPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
