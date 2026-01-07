import {Injectable, signal} from '@angular/core';

export interface CtaConfig {
  icon: string;
  iconType: string | null;
  iconSize: string | null;
  text: string;
  link: string;
  ctaTitle:string;
  ctaStyles?: string;
  textStyles?: string;
  ctaButtonStyles?:string,
}

@Injectable({
  providedIn: 'root'
})
export class CtaService {

  private readonly _cta = signal<CtaConfig | null>(null);
  readonly cta = this._cta.asReadonly();

  readonly scrollVisible = signal<boolean | null>(null);

  setCtaVisibilityByScroll(value: boolean | null) {
    this.scrollVisible.set(value);
  }

  setCta(cta: CtaConfig | null) {
    this._cta.set(cta);
  }
}
