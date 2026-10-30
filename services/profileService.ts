// services/profileService.ts
// ===========================================================
// NOVARIC® Profile Service — Cloud Run aligned
// ===========================================================

import api from "./apiService";
import { VipProfile } from "../types";

// -----------------------------------------------------------
// Normalize backend profile → VipProfile
// -----------------------------------------------------------
const normalizeProfile = (data: any): VipProfile => {
  if (!data) {
    return {
      id: 'unknown',
      name: 'I paidentifikuar',
      imageUrl: "",
      category: "I panjohur",
      shortBio: "",
      detailedBio: "",
      dynamicScore: 0,
      paragonAnalysis: [],
    };
  }
  return {
    ...data,
    id: data.id,
    name: data.name,
    imageUrl: data.imageUrl || data.image_url || "",
    dynamicScore:
      data.dynamicScore ??
      data.overall_score_live ??
      data.overall_score ??
      0,
    paragonAnalysis: Array.isArray(data.paragonAnalysis)
      ? data.paragonAnalysis
      : [],
  };
};

// -----------------------------------------------------------
// Fetch ALL profiles
// GET /api/profiles
// -----------------------------------------------------------
export const fetchAllProfiles = async (): Promise<VipProfile[]> => {
  try {
    // res is directly the response body
    const res: any = await api.get("/api/profiles");

    if (!Array.isArray(res)) {
      console.warn("Profiles payload was not an array:", res);
      return [];
    }

    return res
      .filter(item => !!item)
      .map(normalizeProfile);
  } catch (error) {
    console.error("Failed to fetch profiles:", error);
    return [];
  }
};

// -----------------------------------------------------------
// Fetch profile by ID
// GET /api/profiles/{id}
// -----------------------------------------------------------
export const fetchProfileById = async (
  profileId: string | number
): Promise<VipProfile | null> => {
  try {
    const res: any = await api.get(`/api/profiles/${profileId}`);
    if (!res) return null;
    return normalizeProfile(res);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// -----------------------------------------------------------
// Update profile image URL
// POST /api/update-profile-image
// -----------------------------------------------------------
export const updateProfileImageUrl = async (
  profileId: string | number,
  newImageUrl: string
): Promise<void> => {
  await api.post("/api/update-profile-image", {
    profileId,
    newImageUrl,
  });
};
