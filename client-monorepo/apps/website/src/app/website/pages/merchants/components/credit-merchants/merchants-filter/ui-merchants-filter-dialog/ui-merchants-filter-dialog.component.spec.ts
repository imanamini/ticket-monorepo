import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMerchantsFilterDialogComponent } from './ui-merchants-filter-dialog.component';

describe('UiMerchantsFilterDialogComponent', () => {
  let component: UiMerchantsFilterDialogComponent;
  let fixture: ComponentFixture<UiMerchantsFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiMerchantsFilterDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMerchantsFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
