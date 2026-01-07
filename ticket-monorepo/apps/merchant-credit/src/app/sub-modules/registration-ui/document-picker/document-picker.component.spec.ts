import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPickerComponent } from './document-picker.component';

describe('DocumentPickerComponent', () => {
  let component: DocumentPickerComponent;
  let fixture: ComponentFixture<DocumentPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
