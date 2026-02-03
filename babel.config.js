module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': '.',
            '@/components': './components',
            '@/context': './context',
            '@/services': './services',
            '@/hooks': './hooks',
            '@/types': './types',
            '@/config': './config',
            '@/utils': './utils',
            '@/validation': './validation',
          },
        },
      ],
      'react-native-reanimated/plugin', // Important for Reanimated
    ],
  };
};