import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFlowComponent } from './ui-flow.component';

describe('UiFlowComponent', () => {
  let component: UiFlowComponent;
  let fixture: ComponentFixture<UiFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiFlowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
