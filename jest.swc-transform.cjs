// WHY: Keep the SWC Jest transform in one place so unit and performance test
// configs do not drift when TypeScript transform settings change.
const swcTransform = {
  '^.+\\.tsx?$': [
    '@swc/jest',
    {
      module: {
        type: 'commonjs',
      },
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        target: 'es2022',
      },
    },
  ],
};

module.exports = { swcTransform };
