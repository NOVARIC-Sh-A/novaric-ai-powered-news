
import { useState, useEffect, useCallback } from 'react';
// FIX: Corrected import path for types.
import { VipProfile } from '../types';

type ImageUrlOverrides = { [profileId: string]: string };

export const useProfileData = <T extends VipProfile>(initialProfiles: T[], storageKey: string) => {
  const [profiles, setProfiles] = useState<T[]>(initialProfiles);

  // Load overrides from localStorage on mount
  useEffect(() => {
    try {
      const storedOverrides = localStorage.getItem(storageKey);
      if (storedOverrides) {
        const overrides: ImageUrlOverrides = JSON.parse(storedOverrides);
        setProfiles(prevProfiles =>
          prevProfiles.map(p =>
            overrides[p.id] ? { ...p, imageUrl: overrides[p.id] } : p
          )
        );
      } else {
        // If no overrides, ensure we are using the initial data.
        // This helps if the initialProfiles data changes.
        setProfiles(initialProfiles);
      }
    } catch (error) {
      console.error(`Failed to load photo overrides from localStorage for key "${storageKey}":`, error);
      setProfiles(initialProfiles);
    }
  }, [initialProfiles, storageKey]);

  // Handle photo upload, update state, and save to localStorage
  const handlePhotoUpload = useCallback((profileId: string | number, file: File) => {
    if (!file.type.startsWith('image/')) {
        alert('Ju lutemi, zgjidhni një skedar imazhi të vlefshëm.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        // Update state
        setProfiles(prevProfiles =>
          prevProfiles.map(p =>
            p.id === profileId ? { ...p, imageUrl: dataUrl } : p
          )
        );

        // Update localStorage
        try {
          const storedOverrides = localStorage.getItem(storageKey);
          const overrides: ImageUrlOverrides = storedOverrides ? JSON.parse(storedOverrides) : {};
          overrides[profileId] = dataUrl;
          localStorage.setItem(storageKey, JSON.stringify(overrides));
        } catch (error) {
          console.error(`Failed to save photo override to localStorage for key "${storageKey}":`, error);
        }
      }
    };
    reader.onerror = () => {
        alert('Dështoi leximi i skedarit.');
    };
    reader.readAsDataURL(file);
  }, [storageKey]);
  
  const clearPhotoOverrides = useCallback(() => {
      if(window.confirm(`Jeni të sigurt që doni të rivendosni të gjitha fotot e personalizuara për këtë seksion? Kjo do të rikthejë imazhet origjinale.`)) {
        localStorage.removeItem(storageKey);
        setProfiles(initialProfiles);
        // A full reload is often the cleanest way to ensure all state is reset from top down
        window.location.reload();
      }
  }, [storageKey, initialProfiles]);

  return { profiles, handlePhotoUpload, clearPhotoOverrides };
};