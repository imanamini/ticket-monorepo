import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OCreditTabsComponent } from './o-credit-tabs.component';

describe('OCreditTabsComponent', () => {
  let component: OCreditTabsComponent;
  let fixture: ComponentFixture<OCreditTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OCreditTabsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OCreditTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
