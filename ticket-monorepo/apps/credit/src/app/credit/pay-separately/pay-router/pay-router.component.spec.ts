import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRouterComponent } from './pay-router.component';

describe('PayRouterComponent', () => {
  let component: PayRouterComponent;
  let fixture: ComponentFixture<PayRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
