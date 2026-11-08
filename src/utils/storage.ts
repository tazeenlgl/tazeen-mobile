import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'tazeen.';

// useState that survives app restarts. Starts with `initial`, swaps in the
// stored value once read, and only writes back after that first read so the
// defaults never overwrite saved data. Third value tells when loading ended.
export function usePersistedState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    AsyncStorage.getItem(PREFIX + key)
      .then(raw => {
        if (alive.current && raw !== null) {
          setValue(JSON.parse(raw) as T);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (alive.current) {
          setHydrated(true);
        }
      });
    return () => {
      alive.current = false;
    };
  }, [key]);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)).catch(() => undefined);
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}
