import { useEffect, useState, useCallback } from 'react';
import { useStations, usePermissions } from '@/hooks';
import { useRadioBrowserStations } from '@/hooks/radio-browser';
import { ResponseStationDto, RadioBrowserStation } from '@/core/types';
import { userService } from '@/core/services';

interface StationsResult {
  featuredStation: ResponseStationDto | RadioBrowserStation | null;
  liveStations: ResponseStationDto[] | RadioBrowserStation[];
  madeForYouStations: ResponseStationDto[] | RadioBrowserStation[];
  creatorNames: Record<string, string>;
  isLoading: boolean;
  isError: boolean;
  userType: 'platform' | 'radio-browser';
  userRole: string | undefined;
}

export const useRoleStations = (): StationsResult => {
  const { hasAnyRole, role } = usePermissions();

  const isPremiumUser = hasAnyRole(['pro', 'creator', 'moderator', 'admin']);

  // Hook calls
  const {
    data: ownStations,
    isLoading: isLoadingOwn,
    isError: isErrorOwn
  } = useStations();

  const {
    stations: radioBrowserStations,
    isLoading: isLoadingRadio,
    error: radioError
  } = useRadioBrowserStations({
    strategy: 'random-genre',
    genreFilter: ['garage', 'house', 'techno', 'jazz', 'electronic', 'indie']
  });

  // Local state
  const [featuredStation, setFeaturedStation] = useState<ResponseStationDto | RadioBrowserStation | null>(null);
  const [liveStations, setLiveStations] = useState<ResponseStationDto[] | RadioBrowserStation[]>([]);
  const [madeForYouStations, setMadeForYouStations] = useState<ResponseStationDto[] | RadioBrowserStation[]>([]);
  const [creatorNames, setCreatorNames] = useState<Record<string, string>>({});

  const userType = isPremiumUser ? 'platform' : 'radio-browser';
  const isLoading = isPremiumUser ? isLoadingOwn : isLoadingRadio;
  const isError = isPremiumUser ? isErrorOwn : !!radioError;

  // Process own stations for premium users
  const processOwnStations = useCallback(async () => {
    if (!ownStations || ownStations.length === 0) return;

    const abortController = new AbortController();

    try {
      const randomIndex = Math.floor(Math.random() * ownStations.length);
      const featured = ownStations[randomIndex];
      
      if (abortController.signal.aborted) return;
      setFeaturedStation(featured);

      const sortedStations = [...ownStations]
        .sort((a, b) => {
          const getDate = (createdAt: string | { _seconds: number; _nanoseconds: number }) => {
            if (typeof createdAt === 'string' || typeof createdAt === 'number') {
              return new Date(createdAt).getTime();
            } else if (
              typeof createdAt === 'object' &&
              createdAt !== null &&
              '_seconds' in createdAt
            ) {
              return createdAt._seconds * 1000 + Math.floor(createdAt._nanoseconds / 1e6);
            }
            return 0;
          };
          return getDate(b.createdAt) - getDate(a.createdAt);
        })
        .slice(0, 3);
      
      if (abortController.signal.aborted) return;
      setLiveStations(sortedStations);

      const availableForMadeForYou = ownStations.filter((_, index) => index !== randomIndex);
      const madeForYou = [...availableForMadeForYou]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(2, availableForMadeForYou.length));
      
      if (abortController.signal.aborted) return;
      setMadeForYouStations(madeForYou);

      // Get creator names
      const creatorIds = [
        featured.ownerId,
        ...sortedStations.map(s => s.ownerId),
        ...madeForYou.map(s => s.ownerId)
      ];
      const uniqueCreatorIds = Array.from(new Set(creatorIds));
      const creatorNameMap: Record<string, string> = {};

      await Promise.all(
        uniqueCreatorIds.map(async (creatorId) => {
          if (abortController.signal.aborted) return;
          
          try {
            const user = await userService.getUserById(creatorId);
            creatorNameMap[creatorId] = user.displayName || user.email || 'Unknown Creator';
          } catch {
            creatorNameMap[creatorId] = 'Unknown Creator';
          }
        })
      );

      if (!abortController.signal.aborted) {
        setCreatorNames(creatorNameMap);
      }
    } catch (error) {
      console.error('Error processing own stations:', error);
    }

    return () => abortController.abort();
  }, [ownStations]);

  // Process RadioBrowser stations for basic users
  const processRadioBrowserStations = useCallback(() => {
    if (!radioBrowserStations || radioBrowserStations.length === 0) return;

    const randomIndex = Math.floor(Math.random() * radioBrowserStations.length);
    const featured = radioBrowserStations[randomIndex];
    setFeaturedStation(featured);

    const liveStationsData = [...radioBrowserStations].slice(0, 3);
    setLiveStations(liveStationsData);

    const availableForMadeForYou = radioBrowserStations.filter((_, index) => index !== randomIndex);
    const madeForYou = [...availableForMadeForYou]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, availableForMadeForYou.length));
    setMadeForYouStations(madeForYou);

    // For RadioBrowser, use stationuuid as key and create display names
    const creatorNameMap: Record<string, string> = {};
    [...liveStationsData, ...madeForYou, featured].forEach(station => {
      creatorNameMap[station.stationuuid] = `${station.country} • ${station.language}`;
    });
    setCreatorNames(creatorNameMap);
  }, [radioBrowserStations]);

  // Effects
  useEffect(() => {
    if (isPremiumUser && ownStations) {
      const abortController = new AbortController();

      (async () => {
        try {
          await processOwnStations();
        } catch (e) {
          // handle error if needed
        }
      })();

      return () => {
        abortController.abort();
      };
    }
  }, [isPremiumUser, ownStations, processOwnStations]);

  useEffect(() => {
    if (!isPremiumUser && radioBrowserStations) {
      processRadioBrowserStations();
    }
  }, [isPremiumUser, processRadioBrowserStations]);

  return {
    featuredStation,
    liveStations,
    madeForYouStations,
    creatorNames,
    isLoading,
    isError,
    userType,
    userRole: role
  };
};