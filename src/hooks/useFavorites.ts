import { useState, useEffect, useCallback } from 'react';
import { UndoToastData } from '../components/UI/UndoToast';
import { Station } from '../types';

const STORAGE_KEY = 'gocharge_saved_stations_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [undoToast, setUndoToast] = useState<UndoToastData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage:', e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((stationOrId: Station | string, optionalName?: string) => {
    const stationId = typeof stationOrId === 'string' ? stationOrId : stationOrId.id;
    const stationName = typeof stationOrId === 'string' ? (optionalName || 'Station') : stationOrId.name;

    const isCurrentlySaved = favorites.includes(stationId);
    const previousFavorites = [...favorites];

    if (isCurrentlySaved) {
      // Optimistic removal
      setFavorites((prev) => prev.filter((id) => id !== stationId));

      // Trigger Undo toast with an 7-second window (role="status")
      setUndoToast({
        id: `undo-${stationId}-${Date.now()}`,
        message: `Removed "${stationName}" from saved chargers`,
        durationMs: 7000,
        onUndo: () => {
          // Reversible action: restore
          setFavorites(previousFavorites);
        }
      });
    } else {
      // Optimistic addition
      setFavorites((prev) => [...prev, stationId]);
      setUndoToast(null);
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (stationId: string) => favorites.includes(stationId),
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    undoToast,
    dismissUndoToast: () => setUndoToast(null)
  };
}
