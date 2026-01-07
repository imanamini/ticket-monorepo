import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCheckboxFiltersComponent } from './multiple-checkbox-filters.component';

describe('MultipleCheckboxFiltersComponent', () => {
  let component: MultipleCheckboxFiltersComponent;
  let fixture: ComponentFixture<MultipleCheckboxFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleCheckboxFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleCheckboxFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
