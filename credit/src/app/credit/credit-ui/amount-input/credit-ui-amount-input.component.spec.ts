import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditUiAmountInputComponent } from './credit-ui-amount-input.component';
import { UserInterfaceModule } from '../../user-interface.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UiAmountInputComponent', () => {
  let component: CreditUiAmountInputComponent;
  let fixture: ComponentFixture<CreditUiAmountInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        UserInterfaceModule,
        BrowserAnimationsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditUiAmountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
