import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowHeaderComponent } from './flow-header.component';

describe('FlowHeaderComponent', () => {
  let component: FlowHeaderComponent;
  let fixture: ComponentFixture<FlowHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
