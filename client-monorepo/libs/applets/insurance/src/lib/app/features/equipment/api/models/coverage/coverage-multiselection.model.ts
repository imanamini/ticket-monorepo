export interface CoverageModel {
  description: string;
  id: string;
  identifier: CoverageIdentifiers;
  title: string;
  selected: boolean;
}

export type CoverageIdentifiers =
  'gameConsole'
  | 'laptop'
  | 'mobile'
  | 'tablet'
  | 'damage'
  | 'fire'
  | 'hardware'
  | 'stealing'
  | 'water';
