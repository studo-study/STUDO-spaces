"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/app/ToastProvider";
import Splash from "@/components/ui/overige/effects/Splash";

type SplashContextValue = {
  isLoaded: boolean;
  setLoaded: (value: boolean) => void;
};

const SplashContext = React.createContext<SplashContextValue | null>(null);

export const useSplash = () => {
  const ctx = React.useContext(SplashContext);
  if (!ctx) throw new Error("useSplash must be used within SplashProvider");
  return ctx;
};

const SplashProvider = ({
  children,
  initialLoaded = false,
  timeoutMs = 5000,
  onTimeout,
}: {
  children: React.ReactNode;
  initialLoaded?: boolean;
  timeoutMs?: number;
  // Wat te doen als de timeout verloopt zonder dat er geladen is. Default:
  // toast + terug naar /home. Geef een eigen handler om enkel te dismissen
  // (bv. document-view: gewoon de splash weg, op de pagina blijven).
  onTimeout?: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(initialLoaded);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  const setLoaded = useCallback((value: boolean) => {
    setIsLoaded(value);
  }, []);

  // afgeleide state: open zolang niet geladen en niet uitgetimed
  const isOpen = !isLoaded && !timedOut;

  // Timeout fallback wanneer er niets laadt
  useEffect(() => {
    if (isLoaded) return;

    const timer = setTimeout(() => {
      setIsLoaded((loaded) => {
        if (!loaded) {
          setTimedOut(true);
          if (onTimeout) {
            onTimeout();
          } else {
            toast.error("Can't load set");
            router.push("/home");
          }
        }
        return loaded;
      });
    }, timeoutMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const value = React.useMemo<SplashContextValue>(
    () => ({
      isLoaded,
      setLoaded,
    }),
    [isLoaded, setLoaded],
  );

  return (
    <SplashContext.Provider value={value}>
      {children}
      <Splash isOpen={isOpen} />
    </SplashContext.Provider>
  );
};

export default SplashProvider;
