// HomePage.tsx - Enhanced version with compact header on scroll
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSection } from "@/hooks/useSection";
import { useEnhancedScrollDetection } from "@/hooks/useEnhancedScrollDetection";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useHomeContext } from "@/contexts/HomeContext";
import { PostService } from "@/services/postService";
import {
  Post,
  PostDataExtended,
  convertToPostDataExtended,
  InfinitePostsResponse,
  InfinitePostsParams,
} from "@/types/postTypes";
import { SECTIONS } from "@/types";
import Header from "../../components/Post/view_post/Posts/Header/Header";
import HomeSection from "../../components/Post/view_post/Posts/Header/HomeSection";
import MessagesSection from "../../components/Post/view_post/Posts/Sections/MessagesSection";
import ScrollToTopButton from "../../components/Post/view_post/Posts/UI/ScrollToTop";
import "./HomePage.css";
import { useEffect, useRef, useCallback, useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSection, setActiveSection, isSection } = useSection();
  const postService = PostService.getInstance();
  const refreshCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced scroll detection with more control
  const scrollState = useEnhancedScrollDetection({
    threshold: 30, // Lower threshold for earlier header compacting
    container: containerRef.current,
    fastScrollThreshold: 8, // Detect fast scrolling
    debounceMs: 10, // More responsive updates
  });

  // Add transition state to prevent flash
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  // Get HomeContext to register functions
  const { registerRefreshFunction, registerScrollFunction } = useHomeContext();

  // Sync URL with active section on mount and when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath === '/' || currentPath === '/home') {
      setActiveSection(SECTIONS.HOME);
    } else if (currentPath === '/messages') {
      setActiveSection(SECTIONS.MESSAGES);
    }
  }, [location.pathname, setActiveSection]);

  // Enhanced scroll to top function with smooth animation
  const handleScrollToTop = useCallback(() => {
    console.log('Scrolling to top with enhanced animation');
    if (containerRef.current) {
      // Use a more sophisticated scroll animation
      const container = containerRef.current;
      const startY = container.scrollTop;
      const targetY = 0;
      const duration = Math.min(800, Math.max(400, startY / 3)); // Dynamic duration
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        container.scrollTop = startY - (startY - targetY) * easeOutQuart;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      // Fallback to window scroll
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  }, []);

  // TanStack Query infinite query for fetching posts
  const {
    data,
    isLoading: fetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-posts", refreshCountRef.current],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      console.log(`Fetching page ${pageParam} with refresh count ${refreshCountRef.current}`);
      const params: InfinitePostsParams = {
        page: pageParam,
        limit: pageParam === 1 ? 20 : 10,
        sortBy: "random",
        sortOrder: "desc",
        isFirstLoad: pageParam === 1,
      };
      
      return await postService.fetchInfinitePosts(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: InfinitePostsResponse) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount) => failureCount < 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Enhanced refetch with visual feedback
  const handleRefetch = useCallback(async (): Promise<void> => {
    console.log('Starting enhanced refresh process...');
    try {
      // Reset the seed for new random content
      postService.resetSeed();
      
      // Increment refresh count to invalidate cache
      refreshCountRef.current += 1;
      console.log(`New refresh count: ${refreshCountRef.current}`);
      
      // Force refetch with new query key
      const result = await refetch();
      console.log('Enhanced refetch completed:', result);
      
    } catch (error) {
      console.error("Error refetching posts:", error);
      throw error;
    }
  }, [refetch, postService]);

  // Register functions with HomeContext
  useEffect(() => {
    const currentPath = location.pathname;
    console.log('Registering enhanced functions with HomeContext for path:', currentPath);
    
    if (currentPath === '/' || currentPath === '/home' || currentPath === '/messages') {
      console.log('Registering enhanced refresh and scroll functions in context');
      registerRefreshFunction(handleRefetch);
      registerScrollFunction(handleScrollToTop);
    }

    return () => {
      // Cleanup handled by context
    };
  }, [location.pathname, handleRefetch, handleScrollToTop, registerRefreshFunction, registerScrollFunction]);

  // Enhanced section toggle with visual feedback
  const handleSectionToggle = useCallback((section: typeof activeSection) => {
    // Prevent multiple rapid toggles during transition
    if (isTransitioning) return;
    
    // If already on the same section, don't do anything
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    
    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Update section immediately for responsive feel
    setActiveSection(section);
    
    // Update URL without causing re-render flash
    const targetPath = section === SECTIONS.HOME ? '/' : '/messages';
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
    
    // Reset transition state after animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 450); // Slightly longer for enhanced animations
    
  }, [activeSection, setActiveSection, navigate, location.pathname, isTransitioning]);

  // Reset seed on component mount for fresh content
  useEffect(() => {
    postService.resetSeed();
  }, []);

  // Cleanup transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Use infinite scroll hook with enhanced detection
  const { sentinelRef } = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    onLoadMore: fetchNextPage,
    threshold: 800,
    enabled: isSection(SECTIONS.HOME) && !isTransitioning && !scrollState.isScrollingFast,
  });

  // Enhanced home refresh handler with visual feedback
  const handleHomeRefresh = useCallback(async () => {
    if (!isSection(SECTIONS.HOME) || isTransitioning) {
      return;
    }

    console.log('Enhanced header refresh triggered');
    try {
      await handleRefetch();
      
      // Enhanced scroll to top with delay for better UX
      setTimeout(() => {
        handleScrollToTop();
      }, 100);
      
    } catch (error) {
      console.error("Enhanced home refresh failed:", error);
    }
  }, [isSection, handleRefetch, handleScrollToTop, isTransitioning]);

  // Flatten all pages data and convert to PostDataExtended
  const postList: PostDataExtended[] = (data?.pages || [])
    .flatMap((page: InfinitePostsResponse) => page.data || [])
    .map((post: Post) => {
      const normalizedPost: Post = {
        ...post,
        isBookmarked: post.isBookmarked ?? false,
        user: {
          ...post.user,
          isFollowing: post.user.isFollowing ?? false,
        },
      };

      return convertToPostDataExtended(normalizedPost);
    });

  // Enhanced debug logging
  useEffect(() => {
    console.log('Enhanced HomePage State:', {
      fetching,
      isRefetching,
      postsCount: postList.length,
      refreshCount: refreshCountRef.current,
      scrollState: {
        isScrolled: scrollState.isScrolled,
        scrollY: scrollState.scrollY || 0,
        direction: scrollState.scrollDirection,
        isFast: scrollState.isScrollingFast,
      },
      error: error?.message
    });
  }, [fetching, isRefetching, postList.length, error, scrollState]);
  
  return (
    <>
      {/* Main container with enhanced class names and ref */}
      <div 
        className={`posts-container ${isTransitioning ? 'transitioning' : ''} ${scrollState.isScrollingFast ? 'fast-scrolling' : ''}`}
        ref={containerRef}
      >
        <Header
          isScrolled={scrollState.isScrolled}
          activeSection={activeSection}
          onSectionToggle={handleSectionToggle}
          onHomeRefresh={handleHomeRefresh}
          scrollState={scrollState} // Pass additional scroll info
        />

        <div className="posts-content">
          <HomeSection
            isActive={isSection(SECTIONS.HOME)}
            fetching={fetching || isRefetching}
            postList={postList}
            onRefetch={handleRefetch}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            sentinelRef={sentinelRef}
            error={error}
          />

          <MessagesSection isActive={isSection(SECTIONS.MESSAGES)} />
        </div>
      </div>

      {/* Enhanced ScrollToTop Button with scroll state awareness */}
      {isSection(SECTIONS.HOME) && !isTransitioning && scrollState.hasScrolledPast(300) && (
        <ScrollToTopButton 
          threshold={200} 
          variant="default"
          hideDelay={1500}
        />
      )}
    </>
  );
};

export default HomePage;