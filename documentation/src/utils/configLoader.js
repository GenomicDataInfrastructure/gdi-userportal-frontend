let configCache = null;
let configPromise = null;

/**
 * Fetches the application configuration at runtime
 * Uses CONFIG_PATH environment variable if available, otherwise defaults to /config.json
 * @returns {Promise<Object>} The configuration object
 */
export async function loadConfig() {
  if (configCache) {
    return configCache;
  }

  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    try {
      // For documentation, determine the correct config source
      const isDevelopment = window.location.hostname === 'localhost' && window.location.port === '3000';
      const isStandalonePages = window.location.pathname === '/' || window.location.pathname.startsWith('/docs') === false;

      let configPath;
      if (isDevelopment) {
        // Local development: use dev config file
        configPath = '/docs/dev-config.json';
      } else if (isStandalonePages) {
        // GitLab Pages or standalone hosting: no API available, use fallback
        configPath = null;
      } else {
        // App hosting: use API endpoint
        configPath = '/api/docs/config';
      }

      if (configPath === null) {
        // GitLab Pages or standalone hosting - no API available
        console.log('📄 GitLab Pages mode: using default config with all features disabled');
        throw new Error('No API available - using fallback config');
      }

      console.log('🔍 Attempting to load config from:', isDevelopment ? 'local dev file' : 'API', configPath);

      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const config = await response.json();
      console.log('✅ Successfully loaded config:', isDevelopment ? 'from dev file' : 'from API', Object.keys(config));
      console.log('🏁 Feature flags loaded:', Object.keys(config.feature_flags || {}));
      configCache = config;
      return config;
    } catch (error) {
      console.error('❌ Failed to load configuration from API:', error.message);
      console.warn('📖 Documentation-only mode: treating all feature flags as false');

      // When API is not available (docs-only hosting), treat all flags as false
      // This ensures graceful degradation when documentation is hosted independently
      const fallbackConfig = {
        feature_flags: {}
      };
      configCache = fallbackConfig;
      return fallbackConfig;
    }
  })();

  return configPromise;
}

/**
 * Clears the config cache (useful for testing)
 */
export function clearConfigCache() {
  configCache = null;
  configPromise = null;
}
