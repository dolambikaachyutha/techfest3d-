"use client";

import { create } from "zustand";
import { SECTION } from "./constants";

export type QualityTier = "high" | "medium" | "low";

interface AppState {
  // === Scene State ===
  currentSection: number;
  scrollProgress: number;
  scrollVelocity: number;
  isLoading: boolean;
  loadingProgress: number;
  isBooted: boolean;

  // === Quality ===
  qualityTier: QualityTier;

  // === Accessibility ===
  reducedMotion: boolean;

  // === UI State ===
  introSkipped: boolean;
  audioEnabled: boolean;
  activePanel: string | null;
  navOpen: boolean;

  // === Actions ===
  setCurrentSection: (section: number) => void;
  setScrollProgress: (progress: number) => void;
  setScrollVelocity: (velocity: number) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setIsBooted: (booted: boolean) => void;
  setQualityTier: (tier: QualityTier) => void;
  setReducedMotion: (reduced: boolean) => void;
  setIntroSkipped: (skipped: boolean) => void;
  toggleAudio: () => void;
  setActivePanel: (panel: string | null) => void;
  setNavOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentSection: SECTION.BOOT,
  scrollProgress: 0,
  scrollVelocity: 0,
  isLoading: true,
  loadingProgress: 0,
  isBooted: false,

  qualityTier: "high",

  reducedMotion: false,

  introSkipped: false,
  audioEnabled: false,
  activePanel: null,
  navOpen: false,

  // Actions
  setCurrentSection: (section) => set({ currentSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setIsBooted: (booted) => set({ isBooted: booted }),
  setQualityTier: (tier) => set({ qualityTier: tier }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setIntroSkipped: (skipped) => set({ introSkipped: skipped }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setNavOpen: (open) => set({ navOpen: open }),
}));

// Selectors for optimized re-renders
export const selectCurrentSection = (state: AppState) => state.currentSection;
export const selectScrollProgress = (state: AppState) => state.scrollProgress;
export const selectScrollVelocity = (state: AppState) => state.scrollVelocity;
export const selectIsLoading = (state: AppState) => state.isLoading;
export const selectLoadingProgress = (state: AppState) => state.loadingProgress;
export const selectIsBooted = (state: AppState) => state.isBooted;
export const selectQualityTier = (state: AppState) => state.qualityTier;
export const selectReducedMotion = (state: AppState) => state.reducedMotion;
export const selectAudioEnabled = (state: AppState) => state.audioEnabled;
export const selectActivePanel = (state: AppState) => state.activePanel;
