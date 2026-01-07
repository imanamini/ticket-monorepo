import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplPayFlowComponent } from './bnpl-pay-flow.component';

describe('BnplPayFlowComponent', () => {
  let component: BnplPayFlowComponent;
  let fixture: ComponentFixture<BnplPayFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BnplPayFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplPayFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
