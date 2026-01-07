import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternetInitialComponent } from './internet-initial.component';

describe('InternetInitialComponent', () => {
  let component: InternetInitialComponent;
  let fixture: ComponentFixture<InternetInitialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InternetInitialComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
