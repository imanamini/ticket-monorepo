import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableBnplComponent } from './available-bnpl.component';

describe('AvailableBnplComponent', () => {
  let component: AvailableBnplComponent;
  let fixture: ComponentFixture<AvailableBnplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvailableBnplComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableBnplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
