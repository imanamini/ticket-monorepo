import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommentFormComponent } from './ui-comment-form.component';

describe('UiCommentFormComponent', () => {
  let component: UiCommentFormComponent;
  let fixture: ComponentFixture<UiCommentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiCommentFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
