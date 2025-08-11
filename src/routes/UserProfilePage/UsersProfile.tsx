// UserProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useParams, useLocation } from "react-router-dom";
import { User, Board, post } from "../../components/Account/UsersProfile/types";
import {
  fetchUserByUsername,
  fetchUserBoard,
  fetchUserPosts,
  updateBoardCover,
  updateUserProfilePic,
} from "../../components/Account/UsersProfile/api";
import ProfileHeader from "../../components/Account/UsersProfile/ProfileHeader/ProfileHeader";
import UserInfo from "../../components/Account/UsersProfile/UserInfo/UserInfo";
import ActionSection from "../../components/Account/UsersProfile/ActionSection/ActionSection";
import ContentDisplay from "../../components/Account/UsersProfile/ContentDisplay/ContentDisplay";
import "./UsersProfile.css";

// Define proper types for the API responses
interface PostsPage {
  posts: post[];
  hasMore: boolean;
  totalCount: number;
}

interface UserWithBoard extends User {
  board: Board;
}

const UserProfilePage: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile] = useState(false); // This should be determined by comparing with current user

  const queryClient = useQueryClient();
  const { username } = useParams<{ username: string }>();
  const location = useLocation();

  // Ensure username is available or provide fallback
  if (!username) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-[50vw] mx-auto">
          <div className="text-center">
            <div className="text-white text-lg mb-2">Invalid URL</div>
            <div className="text-gray-400">Username is required</div>
          </div>
        </div>
      </div>
    );
  }

  // Determine active tab from URL
  const getActiveTabFromPath = (): string => {
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    // If the last part is one of our tabs, use it; otherwise default to 'posts'
    if (["posts", "about", "bookmarks", "media"].includes(lastPart)) {
      return lastPart;
    }
    return "posts";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Debug logging
  // console.log("Debug Info:", {
  //   username,
  //   activeTab,
  //   pathname: location.pathname,
  //   windowPath: window.location.pathname,
  //   windowHref: window.location.href,
  // });

  // Fetch user data
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    status: userStatus,
    fetchStatus: userFetchStatus,
  } = useQuery<User>({
    queryKey: ["user", username],
    queryFn: async (): Promise<User> => {
      // console.log("Fetching user with username:", username);
      const result = await fetchUserByUsername(username);
      // console.log("User fetch result:", result);
      return result;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Reduce retries for debugging
  });

  // Debug user query state
  console.log("User Query State:", {
    user,
    userLoading,
    userError: userError?.message,
    userStatus,
    userFetchStatus,
    enabled: !!username,
  });

  // Fetch user board
  const { data: boardData, isLoading: boardLoading } = useQuery<Board[]>({
    queryKey: ["userBoard", user?._id],
    queryFn: () => {
      if (!user?._id) throw new Error("User ID is required");
      return fetchUserBoard(user._id);
    },
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  // Infinite query for user posts with pagination
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: postsLoading,
    error: postsError,
  } = useInfiniteQuery<PostsPage>({
    queryKey: ["userPosts", user?._id],
    queryFn: ({ pageParam = 1 }): Promise<PostsPage> => {
      if (!user?._id) throw new Error("User ID is required");
      console.log("Fetching page:", pageParam, "for user:", user._id);
      return fetchUserPosts(user._id, pageParam as number, 12);
    },
    enabled: !!user?._id,
    initialPageParam: 1, // Required property for useInfiniteQuery
    getNextPageParam: (lastPage: PostsPage, allPages: PostsPage[]) => {
      console.log("getNextPageParam called:", {
        lastPageHasMore: lastPage.hasMore,
        lastPagePostsLength: lastPage.posts.length,
        allPagesLength: allPages.length,
        totalCount: lastPage.totalCount,
        nextPage: lastPage.hasMore ? allPages.length + 1 : undefined,
      });
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for posts
    refetchOnWindowFocus: false,
  });

  // Flatten all posts from all pages
  const allPosts = postsData?.pages.flatMap((page) => page.posts) || [];
  const totalPostsCount = postsData?.pages[0]?.totalCount || 0;

  // Debug logging for posts data
  console.log("Posts Debug Info:", {
    postsData: postsData?.pages,
    allPostsLength: allPosts.length,
    totalPostsCount,
    hasNextPage,
    isFetchingNextPage,
    pagesCount: postsData?.pages.length,
  });

  // Load more posts function
  const loadMorePosts = () => {
    console.log("loadMorePosts called:", {
      hasNextPage,
      isFetchingNextPage,
      canFetch: hasNextPage && !isFetchingNextPage,
    });
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Mutations for updating profile
  const coverUpdateMutation = useMutation({
    mutationFn: updateBoardCover,
    onSuccess: (updatedBoard) => {
      if (user?._id) {
        queryClient.setQueryData(["userBoard", user._id], [updatedBoard]);
      }
    },
    onError: (error) => {
      console.error("Failed to update cover photo:", error);
    },
  });

  const profileUpdateMutation = useMutation({
    mutationFn: updateUserProfilePic,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", username], updatedUser);
    },
    onError: (error) => {
      console.error("Failed to update profile picture:", error);
    },
  });

  // Combine user and board data
  const userData: UserWithBoard | null =
    user && boardData
      ? {
          ...user,
          board:
            boardData[0] ||
            ({
              _id: "",
              socialStats: {
                followers: 0,
                following: 0,
                posts: totalPostsCount, // Use actual post count from API
                likes: 0,
              },
            } as Board),
        }
      : null;

  // Update board data with actual post count if available
  if (userData && userData.board && totalPostsCount > 0) {
    userData.board.socialStats = {
      ...userData.board.socialStats,
      posts: totalPostsCount,
    };
  }

  const handleCoverUpdate = (newCoverUrl: string) => {
    if (!userData?.board?._id) return;

    coverUpdateMutation.mutate({
      boardId: userData.board._id,
      coverPhoto: newCoverUrl,
    });
  };

  const handleProfileUpdate = (newProfileUrl: string) => {
    if (!userData?._id) return;

    profileUpdateMutation.mutate({
      userId: userData._id,
      profilepic: newProfileUrl,
    });
  };

  const handleFollowToggle = () => {
    // TODO: Implement follow/unfollow mutation
    setIsFollowing(!isFollowing);

    // Optimistically update the cache
    if (userData && user?._id) {
      queryClient.setQueryData(
        ["userBoard", user._id],
        (old: Board[] | undefined) => {
          if (!old || !old[0]) return old;
          return [
            {
              ...old[0],
              socialStats: {
                ...old[0].socialStats,
                followers:
                  old[0].socialStats.followers + (isFollowing ? -1 : 1),
              },
            },
          ];
        }
      );
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const isLoading = userLoading || boardLoading;
  const error = userError || postsError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-full sm:max-w-[50vw] mx-auto px-4 sm:px-0">
          <div className="text-center">
            {/* Enhanced Loading Spinner */}
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-blue-400 rounded-full animate-spin mx-auto"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>

            {/* Loading Text with Animation */}
            <div className="text-white text-xl mb-3 font-medium animate-pulse">
              Loading profile...
            </div>
            <div className="text-gray-400 text-sm animate-pulse">
              Preparing user information
            </div>

            {/* Loading Progress Dots */}
            <div className="flex justify-center gap-1 mt-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-[50vw] mx-auto">
          <div className="text-center max-w-md mx-auto">
            <div className="text-red-400 text-lg mb-2">
              Oops! Something went wrong
            </div>
            <div className="text-gray-400 mb-4">{error.message}</div>
            <div className="text-sm text-gray-500 bg-gray-800 p-4 rounded">
              <div>Debug Info:</div>
              <div>Username: {username}</div>
              <div>API Base: http://localhost:4000</div>
              <div>
                Full URL: http://localhost:4000/users/username/
                {username}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-[50vw] mx-auto">
          <div className="text-center">
            <div className="text-white text-lg mb-2">User not found</div>
            <div className="text-gray-400">
              The profile you're looking for doesn't exist
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full max-w-full sm:max-w-[50vw] mx-auto">
        <div className="bg-black overflow-hidden">
          <ProfileHeader
            userData={userData}
            isOwnProfile={isOwnProfile}
            onCoverUpdate={handleCoverUpdate}
            onProfileUpdate={handleProfileUpdate}
          />

          <UserInfo userData={userData} />

          <ActionSection
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            activeTab={activeTab}
            userName={username}
            onFollowToggle={handleFollowToggle}
            onTabChange={handleTabChange}
          />

          <ContentDisplay
            activeTab={activeTab}
            userData={userData}
            posts={allPosts}
            isLoading={postsLoading}
            hasMore={hasNextPage}
            loadMore={loadMorePosts}
            isLoadingMore={isFetchingNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
