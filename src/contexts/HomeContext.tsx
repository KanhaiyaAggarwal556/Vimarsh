// contexts/HomeContext.tsx - Simplified and more reliable version
import React, { createContext, useContext, useRef, useCallback } from 'react';

interface HomeContextType {
  // Register refresh function
  registerRefreshFunction: (fn: () => Promise<void>) => void;
  // Register scroll function  
  registerScrollFunction: (fn: () => void) => void;
  // Combined home tap handler
  handleHomeTap: () => Promise<void>;
  // Cleanup functions
  cleanup: () => void;
}

const HomeContext = createContext<HomeContextType | null>(null);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

interface HomeProviderProps {
  children: React.ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  // Use refs to store the latest functions - prevents stale closures
  const refreshFunctionRef = useRef<(() => Promise<void>) | null>(null);
  const scrollFunctionRef = useRef<(() => void) | null>(null);
  
  // Double-tap detection state
  const lastTapTimeRef = useRef<number>(0);
  const tapCountRef = useRef(0);
  const resetTimerRef = useRef<NodeJS.Timeout>();
  const isRefreshingRef = useRef(false);
  const doubleTapDelay = 400;

  // Register functions
  const registerRefreshFunction = useCallback((fn: () => Promise<void>) => {
    console.log('Registering refresh function');
    refreshFunctionRef.current = fn;
  }, []);

  const registerScrollFunction = useCallback((fn: () => void) => {
    console.log('Registering scroll function');
    scrollFunctionRef.current = fn;
  }, []);

  // Enhanced home tap with proper double-tap handling
  const handleHomeTap = useCallback(async () => {
    // Prevent multiple rapid taps during refresh
    if (isRefreshingRef.current) {
      console.log('Already refreshing, ignoring tap');
      return;
    }

    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTimeRef.current;
    
    // Clear any existing reset timer
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    // If this tap is within the double-tap window
    if (timeSinceLastTap < doubleTapDelay && timeSinceLastTap > 0) {
      tapCountRef.current += 1;
      console.log(`Tap count: ${tapCountRef.current}, Time since last: ${timeSinceLastTap}ms`);
      
      // Double tap detected
      if (tapCountRef.current >= 2) {
        console.log('Double tap detected - refreshing home content');
        tapCountRef.current = 0;
        lastTapTimeRef.current = 0;
        
        // Get the current refresh function
        const refreshFn = refreshFunctionRef.current;
        const scrollFn = scrollFunctionRef.current;
        
        if (refreshFn) {
          isRefreshingRef.current = true;
          
          try {
            console.log('Calling refresh function...');
            await refreshFn();
            console.log('Refresh completed successfully');
            
            // Scroll to top after successful refresh
            setTimeout(() => {
              if (scrollFn) {
                console.log('Scrolling to top after refresh');
                scrollFn();
              }
            }, 100);
          } catch (error) {
            console.error('Refresh failed:', error);
            
            // Still scroll to top on error
            if (scrollFn) {
              console.log('Scrolling to top after refresh error');
              scrollFn();
            }
          } finally {
            setTimeout(() => {
              isRefreshingRef.current = false;
            }, 500);
          }
        } else {
          console.log('No refresh function available, just scrolling to top');
          // No refresh function, just scroll to top
          const scrollFn = scrollFunctionRef.current;
          if (scrollFn) {
            scrollFn();
          }
        }
        return;
      }
    } else {
      // Reset tap count for new tap sequence
      tapCountRef.current = 1;
      console.log(`New tap sequence started, count: ${tapCountRef.current}`);
    }

    // Update last tap time
    lastTapTimeRef.current = currentTime;
    
    // Single tap - scroll to top immediately
    console.log('Single tap - scrolling to top');
    const scrollFn = scrollFunctionRef.current;
    if (scrollFn) {
      scrollFn();
    }
    
    // Set timer to reset tap count after delay
    resetTimerRef.current = setTimeout(() => {
      console.log('Resetting tap count after timeout');
      tapCountRef.current = 0;
      lastTapTimeRef.current = 0;
    }, doubleTapDelay);
    
  }, [doubleTapDelay]);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up HomeContext');
    refreshFunctionRef.current = null;
    scrollFunctionRef.current = null;
    tapCountRef.current = 0;
    lastTapTimeRef.current = 0;
    isRefreshingRef.current = false;
    
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }, []);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const contextValue: HomeContextType = {
    registerRefreshFunction,
    registerScrollFunction,
    handleHomeTap,
    cleanup
  };

  return (
    <HomeContext.Provider value={contextValue}>
      {children}
    </HomeContext.Provider>
  );
};