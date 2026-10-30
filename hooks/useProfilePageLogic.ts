
import { useState, useEffect, useCallback, useMemo } from 'react';
// FIX: Corrected import path for types.
import { VipProfile } from '../types';

type ClickCounts = { [profileId: string | number]: number };

export const useProfilePageLogic = <T extends VipProfile>(profiles: T[], storageKey: string) => {
  const [clickCounts, setClickCounts] = useState<ClickCounts>({});

  useEffect(() => {
    try {
      const storedClicks = localStorage.getItem(storageKey);
      if (storedClicks) {
        setClickCounts(JSON.parse(storedClicks));
      }
    } catch (error) {
      console.error(`Failed to load or parse click counts from localStorage key "${storageKey}":`, error);
      setClickCounts({});
    }
  }, [storageKey]);

  const handleProfileClick = useCallback((profileId: string | number) => {
    setClickCounts(prevCounts => {
      const newCounts = { ...prevCounts, [profileId]: (prevCounts[profileId] || 0) + 1 };
      try {
        localStorage.setItem(storageKey, JSON.stringify(newCounts));
      } catch (error) {
        console.error(`Failed to save click counts to localStorage for key "${storageKey}":`, error);
      }
      return newCounts;
    });
  }, [storageKey]);

  const top5ClickedProfiles = useMemo(() => {
    return Object.entries(clickCounts)
      .sort(([, clicksA], [, clicksB]) => Number(clicksB) - Number(clicksA))
      .slice(0, 5)
      .map(([id, clicks]) => {
        const profile = profiles.find(p => p.id.toString() === id);
        return profile ? { ...profile, clicks } : null;
      })
      .filter((p): p is T & { clicks: number } => !!p);
  }, [clickCounts, profiles]);

  return {
    top5ClickedProfiles,
    handleProfileClick,
  };
};