import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinFlowComponent } from './join-flow.component';

describe('JoinFlowComponent', () => {
  let component: JoinFlowComponent;
  let fixture: ComponentFixture<JoinFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinFlowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
