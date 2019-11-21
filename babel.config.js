module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@components': './src/components',
          '@pages': './src/pages',
          '@config': './src/config',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
