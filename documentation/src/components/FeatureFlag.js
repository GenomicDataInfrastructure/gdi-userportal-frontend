import React, { useState, useEffect } from 'react';
import { loadConfig } from '../utils/configLoader';

/**
 * FeatureFlag component that conditionally renders content based on feature flags
 *
 * @param {Object} props
 * @param {string} props.flag - The feature flag key to check
 * @param {React.ReactNode} props.children - Content to render when feature is enabled
 * @param {React.ReactNode} props.fallback - Content to render when feature is disabled (default: null)
 * @param {boolean} props.inverse - If true, renders children when flag is disabled (default: false)
 * @returns {React.ReactNode}
 */
export default function FeatureFlag({ flag, children, fallback = null, inverse = false }) {
  const [featureFlags, setFeatureFlags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('FeatureFlag render:', { flag, inverse });

  useEffect(() => {
    loadConfig()
      .then(config => {
        setFeatureFlags(config.feature_flags || {});
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        console.error('Failed to load feature flags:', err);
      });
  }, []);

  if (loading) {
    return <div style={{ opacity: 0.5 }}>Loading...</div>;
  }

  if (error) {
    // In case of error, show content by default to avoid breaking the documentation
    return children;
  }

  // If flag doesn't exist in featureFlags, treat as false (disabled)
  // This handles both API failures and docs-only hosting scenarios
  const isEnabled = featureFlags && featureFlags[flag] === true;
  const shouldShow = inverse ? !isEnabled : isEnabled;

  return shouldShow ? children : fallback;
}

/**
 * Hook to access feature flags in functional components
 *
 * @returns {Object} { featureFlags, loading, error }
 */
export function useFeatureFlags() {
  const [featureFlags, setFeatureFlags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConfig()
      .then(config => {
        setFeatureFlags(config.feature_flags || {});
        console.log('Feature flags loaded:', config.feature_flags);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { featureFlags, loading, error };
}
