import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgSlideToggleComponent } from './dg-slide-toggle.component';

describe('HesSlideToggleComponent', () => {
  let component: DgSlideToggleComponent;
  let fixture: ComponentFixture<DgSlideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgSlideToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgSlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
