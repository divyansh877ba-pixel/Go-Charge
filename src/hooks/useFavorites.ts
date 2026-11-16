import { useState, useEffect, useCallback } from 'react';
import { UndoToastData } from '../components/UI/UndoToast';
import { Station } from '../types';
import { supabase } from '../lib/supabase';
import { fetchUserFavorites, addUserFavorite, removeUserFavorite } from '../lib/supabaseService';

const STORAGE_KEY = 'gocharge_saved_stations_v1';

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [undoToast, setUndoToast] = useState<UndoToastData | null>(null);

  // Sync favorites with Supabase database when user is authenticated
  useEffect(() => {
    let isMounted = true;

    async function loadDbFavorites() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const dbFavs = await fetchUserFavorites();
      if (isMounted && dbFavs && dbFavs.length > 0) {
        setFavorites((prev) => Array.from(new Set([...prev, ...dbFavs])));
      }
    }

    loadDbFavorites();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage:', e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback(async (stationOrId: Station | string, optionalName?: string) => {
    const stationId = typeof stationOrId === 'string' ? stationOrId : stationOrId.id;
    const stationName = typeof stationOrId === 'string' ? (optionalName || 'Station') : stationOrId.name;

    const isCurrentlySaved = favorites.includes(stationId);
    const previousFavorites = [...favorites];

    const currentSession = (await supabase.auth.getSession()).data.session;
    const activeUserId = userId || currentSession?.user?.id;

    if (isCurrentlySaved) {
      // Optimistic removal
      setFavorites((prev) => prev.filter((id) => id !== stationId));

      if (activeUserId) {
        removeUserFavorite(stationId);
      }

      // Trigger Undo toast with an 7-second window
      setUndoToast({
        id: `undo-${stationId}-${Date.now()}`,
        message: `Removed "${stationName}" from saved chargers`,
        durationMs: 7000,
        onUndo: () => {
          setFavorites(previousFavorites);
          if (activeUserId) {
            addUserFavorite(stationId);
          }
        }
      });
    } else {
      // Optimistic addition
      setFavorites((prev) => [...prev, stationId]);
      setUndoToast(null);

      if (activeUserId) {
        addUserFavorite(stationId);
      }
    }
  }, [favorites, userId]);

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
