const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force CJS resolution — prevents packages from resolving to their ESM builds
// which contain `import.meta` syntax that crashes the Metro bundle at runtime.
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];

module.exports = config;
