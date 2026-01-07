import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommentComponent } from './ui-comment.component';

describe('UiCommentComponent', () => {
  let component: UiCommentComponent;
  let fixture: ComponentFixture<UiCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiCommentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
