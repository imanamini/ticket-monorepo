import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuePropositionComponent } from './value-proposition.component';

describe('ValuePropositionComponent', () => {
  let component: ValuePropositionComponent;
  let fixture: ComponentFixture<ValuePropositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValuePropositionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValuePropositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
