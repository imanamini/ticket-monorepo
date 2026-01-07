import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDialogComponent } from './page-dialog.component';
import { UserInterfaceModule } from '../../user-interface.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const TEST_HTML = '<html><body><h1>Hello World!</h1></body></html>';

describe('PageDialogComponent', () => {

  let component: PageDialogComponent;
  let fixture: ComponentFixture<PageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        UserInterfaceModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Tac Page test',
            html: TEST_HTML,
          },
        },
        {
          provide: MatDialogRef,
          useValue: {},
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows HTML', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('iframe').srcdoc).toEqual(TEST_HTML);
  });
});
