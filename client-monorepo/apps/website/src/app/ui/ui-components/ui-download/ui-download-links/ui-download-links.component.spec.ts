import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDownloadLinksComponent } from './ui-download-links.component';

describe('UiDownloadLinksComponent', () => {
  let component: UiDownloadLinksComponent;
  let fixture: ComponentFixture<UiDownloadLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDownloadLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDownloadLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
