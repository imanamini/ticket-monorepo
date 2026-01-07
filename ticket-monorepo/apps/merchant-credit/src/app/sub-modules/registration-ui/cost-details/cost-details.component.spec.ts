import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDetailsComponent } from './cost-details.component';

describe('CostDetailsComponent', () => {
  let component: CostDetailsComponent;
  let fixture: ComponentFixture<CostDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
