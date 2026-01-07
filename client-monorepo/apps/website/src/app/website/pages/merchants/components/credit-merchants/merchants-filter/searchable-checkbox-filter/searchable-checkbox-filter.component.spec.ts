import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableCheckboxFilterComponent } from './searchable-checkbox-filter.component';

describe('SearchableCheckboxFilterComponent', () => {
  let component: SearchableCheckboxFilterComponent;
  let fixture: ComponentFixture<SearchableCheckboxFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchableCheckboxFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableCheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
