import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiNoteBoxComponent } from './ui-note-box.component';

describe('UiNoteBoxComponent', () => {
  let component: UiNoteBoxComponent;
  let fixture: ComponentFixture<UiNoteBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiNoteBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiNoteBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
