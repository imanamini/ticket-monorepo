import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUploadMediaComponent } from './get-upload-media.component';

describe('GetUploadMediaComponent', () => {
  let component: GetUploadMediaComponent;
  let fixture: ComponentFixture<GetUploadMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetUploadMediaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetUploadMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
