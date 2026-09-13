import * as ExpoModulesCore from 'expo-modules-core';

// Polyfill registerWebModule for Expo Web bundler compatibility
if (ExpoModulesCore && typeof ExpoModulesCore.registerWebModule !== 'function') {
  ExpoModulesCore.registerWebModule = function (moduleClass, name) {
    return moduleClass;
  };
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
