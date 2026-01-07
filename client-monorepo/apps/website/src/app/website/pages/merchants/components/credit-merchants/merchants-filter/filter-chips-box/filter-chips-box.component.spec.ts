import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterChipsBoxComponent } from './filter-chips-box.component';

describe('FilterChipsBoxComponent', () => {
  let component: FilterChipsBoxComponent;
  let fixture: ComponentFixture<FilterChipsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterChipsBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterChipsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
