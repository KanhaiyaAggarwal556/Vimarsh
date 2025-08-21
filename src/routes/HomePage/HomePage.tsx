// HomePage.tsx - Fixed with proper debugging and state management
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { useSection } from "@/hooks/useSection";
import { useScrollDetection } from "@/hooks/useScrollDetection";
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
  const isScrolled = useScrollDetection();
  const postService = PostService.getInstance();
  const refreshCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Enhanced scroll to top function
  const handleScrollToTop = useCallback(() => {
    console.log('Scrolling to top');
    if (containerRef.current) {
      containerRef.current.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
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

  // Enhanced refetch - reset seed and get fresh content
  const handleRefetch = useCallback(async (): Promise<void> => {
    console.log('Starting refresh process...');
    try {
      // Reset the seed for new random content
      postService.resetSeed();
      
      // Increment refresh count to invalidate cache
      refreshCountRef.current += 1;
      console.log(`New refresh count: ${refreshCountRef.current}`);
      
      // Force refetch with new query key
      const result = await refetch();
      console.log('Refetch completed:', result);
      
      // Don't return the result, just void
    } catch (error) {
      console.error("Error refetching posts:", error);
      throw error;
    }
  }, [refetch, postService]);

  // Register functions with HomeContext - FIXED: Use new simplified context
  useEffect(() => {
    const currentPath = location.pathname;
    console.log('Registering functions with HomeContext for path:', currentPath);
    
    if (currentPath === '/' || currentPath === '/home' || currentPath === '/messages') {
      console.log('Registering refresh and scroll functions in context');
      registerRefreshFunction(handleRefetch);
      registerScrollFunction(handleScrollToTop);
    }

    // Cleanup when component unmounts or path changes
    return () => {
      // No explicit cleanup needed - refs will be overwritten
    };
  }, [location.pathname, handleRefetch, handleScrollToTop, registerRefreshFunction, registerScrollFunction]);

  // Optimized section toggle with transition management
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
    }, 400); // Match CSS transition duration
    
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

  // Use infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    onLoadMore: fetchNextPage,
    threshold: 800,
    enabled: isSection(SECTIONS.HOME) && !isTransitioning,
  });

  // Simplified home refresh handler - only for header double-tap refresh
  const handleHomeRefresh = useCallback(async () => {
    if (!isSection(SECTIONS.HOME) || isTransitioning) {
      return;
    }

    console.log('Header refresh triggered');
    try {
      await handleRefetch();
      
      // Scroll to top using the container ref
      handleScrollToTop();
      
    } catch (error) {
      console.error("Home refresh failed:", error);
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

  // Debug current state
  useEffect(() => {
    console.log('HomePage State:', {
      fetching,
      isRefetching,
      postsCount: postList.length,
      refreshCount: refreshCountRef.current,
      error: error?.message
    });
  }, [fetching, isRefetching, postList.length, error]);
  
  return (
    <>
      {/* Main container with proper class name and ref */}
      <div 
        className={`posts-container ${isTransitioning ? 'transitioning' : ''}`}
        ref={containerRef}
      >
        <Header
          isScrolled={isScrolled}
          activeSection={activeSection}
          onSectionToggle={handleSectionToggle}
          onHomeRefresh={handleHomeRefresh}
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

      {/* ScrollToTop Button - Outside container to avoid z-index issues */}
      {isSection(SECTIONS.HOME) && !isTransitioning && (
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