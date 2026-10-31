import { useEffect, useState } from 'react';

/** Public switch. `public/paragon-ratings.json` can be replaced without rebuilding the app. */
export function useParagonRatingsEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/paragon-ratings.json', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && data.enabled === false) setEnabled(false);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return enabled;
}
