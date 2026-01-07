/* eslint-disable */
export default {
  displayName: "features",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  coverageDirectory: '../../../../coverage/libs/shared/pillar/digikala',
  transform: {
    "^.+\\.(ts|mjs|js|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.(html|svg)$",
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
  snapshotSerializers: [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
  moduleNameMapper: {
    "^@client-monorepo/common/(.*)$": "<rootDir>/../../../../libs/shared/common/$1/src/index.ts",
    "^@client-monorepo/applets/(.*)$": "<rootDir>/../../../../libs/applets/$1/src/index.ts",
    "^@client-monorepo/daily-fintech/(.*)$": "<rootDir>/../../../../libs/shared/daily-fintech/$1/src/index.ts",
    "^@client-monorepo/payment/(.*)$": "<rootDir>/../../../../libs/shared/payment/$1/src/index.ts",
  },
};
