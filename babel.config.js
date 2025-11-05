const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'dotenv',
        path: '.env',
        allowlist: ['API_URL', 'RETRY_ATTEMPTS'],
        safe: false,
        allowUndefined: false,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: [path.resolve(__dirname)],
        alias: {
          '@components': path.resolve(__dirname, 'src/components'),
          '@constants': path.resolve(__dirname, 'src/constants'),
          '@contexts': path.resolve(__dirname, 'src/contexts'),
          '@hooks': path.resolve(__dirname, 'src/hooks'),
          '@lib': path.resolve(__dirname, 'src/lib'),
          '@navigation': path.resolve(__dirname, 'src/navigation'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@screens': path.resolve(__dirname, 'src/screens'),
          '@store': path.resolve(__dirname, 'src/store'),
          '@theme': path.resolve(__dirname, 'src/theme'),
          '@types': path.resolve(__dirname, 'src/types'),
          '@utils': path.resolve(__dirname, 'src/utils'),
        },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
