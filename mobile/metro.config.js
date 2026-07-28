const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * zustand's ESM build (`middleware.mjs`) uses `import.meta.env` to detect Redux DevTools.
 * React Native strips that on native, but the web dev bundle is evaluated as a classic
 * script, so it throws `Cannot use 'import.meta' outside a module` and the app renders
 * blank. Turning package exports off for zustand on web resolves it to the CJS build,
 * which has no `import.meta`. Scoped to web + zustand so nothing else changes.
 */
const baseResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isZustand = moduleName === 'zustand' || moduleName.startsWith('zustand/');

  if (platform === 'web' && isZustand) {
    return context.resolveRequest(
      { ...context, unstable_enablePackageExports: false },
      moduleName,
      platform,
    );
  }

  return (baseResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
