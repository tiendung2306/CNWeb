module.exports = {
    transform: {
        '^.+\\.[jt]sx?$': ['babel-jest', {
          cacheDirectory: '/tmp'
        }]
      }
};
