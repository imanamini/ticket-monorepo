import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadIntroComponent } from './download-intro.component';

describe('DownloadIntroComponent', () => {
  let component: DownloadIntroComponent;
  let fixture: ComponentFixture<DownloadIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadIntroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
