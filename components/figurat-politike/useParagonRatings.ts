import { useEffect, useState } from 'react';
import { scoresArePublic } from '../../services/paragonPublicationGate';

/**
 * Public switch. Defaults off. A fetch failure, a missing file, or a file that
 * only says enabled=true does not publish scores.
 */
export function useParagonRatingsEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/paragon-ratings.json', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled) return;
        setEnabled(scoresArePublic(data, true));
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return enabled;
}
