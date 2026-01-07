import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDownloadComponent } from './popup-download.component';

describe('PopupDownloadComponent', () => {
  let component: PopupDownloadComponent;
  let fixture: ComponentFixture<PopupDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupDownloadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
