import { useEffect, useState } from 'react';
import { bundledScoresArePublic, scoresArePublic } from '../../services/paragonPublicationGate';

/**
 * Public switch. Follows the bundled authorization, then the fetched flag.
 * enabled=true alone does not publish. A missing authorization stays closed.
 */
export function useParagonRatingsEnabled(): boolean {
  const [enabled, setEnabled] = useState(() => bundledScoresArePublic(true));

  useEffect(() => {
    let cancelled = false;
    fetch('/paragon-ratings.json', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled) return;
        setEnabled(data ? scoresArePublic(data, true) : bundledScoresArePublic(true));
      })
      .catch(() => {
        if (!cancelled) setEnabled(bundledScoresArePublic(true));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return enabled;
}
