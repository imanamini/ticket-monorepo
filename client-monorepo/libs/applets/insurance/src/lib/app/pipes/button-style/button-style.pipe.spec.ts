import { ButtonStylePipe } from './button-style.pipe';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { TestBed } from '@angular/core/testing';

describe('ButtonStylePipe', () => {
  let buttonStylePipe: ButtonStylePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ButtonStylePipe]
    }).compileComponents();
    buttonStylePipe = TestBed.inject(ButtonStylePipe);
  });

  it('should convert type fill', () => {
    const result: any = buttonStylePipe.transform(InsButtonStyleEnum.Fill);
    expect(typeof result === 'string').toBe(true);
    expect(result).toBe('fill');
  });

  it('should convert type tinted-on-back', () => {
    const result: any = buttonStylePipe.transform(InsButtonStyleEnum.TintedOnBack);
    expect(typeof result === 'string').toBe(true);
    expect(result).toBe('tinted-on-back');
  });

  it('should convert type tinted-on-elevated', () => {
    const result: any = buttonStylePipe.transform(InsButtonStyleEnum.TintedOnElevated);
    expect(typeof result === 'string').toBe(true);
    expect(result).toBe('tinted-on-elevated');
  });

  it('should convert type link', () => {
    const result: any = buttonStylePipe.transform(InsButtonStyleEnum.Link);
    expect(typeof result === 'string').toBe(true);
    expect(result).toBe('link');
  });

  it('should convert type neutral-link', () => {
    const result: any = buttonStylePipe.transform(InsButtonStyleEnum.NeutralLink);
    expect(typeof result === 'string').toBe(true);
    expect(result).toBe('neutral-link');
  });

  it('should convert type brand', () => {
    const result: any = buttonStylePipe.transform(InsButtonStyleEnum.Brand);
    expect(typeof result === 'string').toBe(true);
    expect(result).toBe('brand');
  });
});
