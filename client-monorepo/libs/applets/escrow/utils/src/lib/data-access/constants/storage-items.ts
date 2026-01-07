export const PossibleStorageItems = ['link-item', 'zone'] as const;

export type PossibleStorageItems = (typeof PossibleStorageItems)[number];
