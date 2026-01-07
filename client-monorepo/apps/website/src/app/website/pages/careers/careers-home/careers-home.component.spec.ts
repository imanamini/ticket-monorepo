import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareersHomeComponent } from './careers-home.component';

describe('CareersHomeComponent', () => {
  let component: CareersHomeComponent;
  let fixture: ComponentFixture<CareersHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareersHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CareersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
