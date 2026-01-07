import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPdfViewerComponent } from './ui-pdf-viewer.component';

describe('UiPdfViewerComponent', () => {
  let component: UiPdfViewerComponent;
  let fixture: ComponentFixture<UiPdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiPdfViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
