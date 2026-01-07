import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppLinksComponent } from './download-app-links.component';

describe('DownloadAppLinksComponent', () => {
  let component: DownloadAppLinksComponent;
  let fixture: ComponentFixture<DownloadAppLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadAppLinksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAppLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
