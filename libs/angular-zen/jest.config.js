module.exports = {
  displayName: 'angular-zen',
  preset: '../../jest.preset.js',
  // Jest ignores node_modules by default and doesn't transform it. As lodash-es exports raw ES5 modules so they can be later transformed by consumers,
  // it is necessary for Jest to transform them. It is possible to tell Jest to transfrom lodash-es using `transformIgnorePatterns`, however, transforming
  // takes a lot of time so for testing purposes lodash-es is replaced with lodash. See https://stackoverflow.com/a/54117206/4371525
  moduleNameMapper: {
    "^lodash-es$": "lodash"
  },
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  coverageDirectory: '../../coverage/libs/angular-zen',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
