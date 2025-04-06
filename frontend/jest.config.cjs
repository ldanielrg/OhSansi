module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx'],
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy' // Por si importas CSS
    }
  };
  