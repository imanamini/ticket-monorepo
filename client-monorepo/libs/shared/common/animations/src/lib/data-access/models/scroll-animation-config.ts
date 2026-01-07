export interface ScrollAnimationConfig {
  scrollFrom: number; // pixels
  scrollTo: number; // pixels
  start: Partial<CSSStyleDeclaration>; // e.g. { opacity: "1", transform: "translateY(50px)" }
  end: Partial<CSSStyleDeclaration>; // e.g. { opacity: "0", transform: "translateY(0)" }
}
