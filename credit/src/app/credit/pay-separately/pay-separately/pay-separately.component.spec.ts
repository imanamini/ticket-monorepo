import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySeparatelyComponent } from './pay-separately.component';

describe('PaySeparatelyComponent', () => {
  let component: PaySeparatelyComponent;
  let fixture: ComponentFixture<PaySeparatelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaySeparatelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySeparatelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
