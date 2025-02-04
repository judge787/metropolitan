module.exports = {
    transform: {
      "^.+\.[tj]sx?$": "babel-jest"
    },
    transformIgnorePatterns: [
      "node_modules/(?!(@bundled-es-modules)/)"
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    testMatch: [
      '**/tests/**/*.ts?(x)'
    ]
};