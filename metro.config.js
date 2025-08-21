const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure Expo Router works properly on Android
config.resolver.unstable_enableSymlinks = false;

module.exports = withNativeWind(config, { input: './global.css' });
