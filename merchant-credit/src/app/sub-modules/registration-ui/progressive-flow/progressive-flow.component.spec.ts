import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressiveFlowComponent } from './progressive-flow.component';

describe('ProgressiveFlowComponent', () => {
  let component: ProgressiveFlowComponent;
  let fixture: ComponentFixture<ProgressiveFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressiveFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressiveFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
