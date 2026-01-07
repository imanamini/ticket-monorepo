import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiKeyValueListComponent } from './ui-key-value-list.component';

describe('UiKeyValueListComponent', () => {
  let component: UiKeyValueListComponent;
  let fixture: ComponentFixture<UiKeyValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiKeyValueListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiKeyValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
