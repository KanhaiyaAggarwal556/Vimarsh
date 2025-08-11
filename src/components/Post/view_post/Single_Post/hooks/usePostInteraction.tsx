import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@store/useAuthStore";

const API_BASE_URL =
  `${import.meta.env.VITE_API_BASE_URL}/api`;

// Types
interface PostReactions {
  likes: number;
  dislikes: number;
}

interface InitialPost {
  reactions?: PostReactions;
  views?: number;
}

interface PostData {
  likes: number;
  dislikes: number;
  views: number;
}

interface LoadingStates {
  like: boolean;
  dislike: boolean;
  share: boolean;
  view: boolean;
}

interface AnimationStates {
  like: boolean;
  dislike: boolean;
  share: boolean;
}

interface UserInteraction {
  liked: boolean;
  disliked: boolean;
  viewed: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface LikeDislikeResponse {
  liked: boolean;
  disliked: boolean;
  reactions: PostReactions;
}

interface InteractionsResponse {
  [postId: string]: UserInteraction;
}

export const usePostInteractions = (
  postId: string,
  initialPost?: InitialPost
) => {
  const { currentUser } = useAuthStore();

  const [localInteractions, setLocalInteractions] = useState<{
    [postId: string]: UserInteraction;
  }>({});

  const [postData, setPostData] = useState<PostData>({
    likes: initialPost?.reactions?.likes || 0,
    dislikes: initialPost?.reactions?.dislikes || 0,
    views: initialPost?.views || 0,
  });

  const [loading, setLoading] = useState<LoadingStates>({
    like: false,
    dislike: false,
    share: false,
    view: false,
  });

  const [animations, setAnimations] = useState<AnimationStates>({
    like: false,
    dislike: false,
    share: false,
  });

  const userLiked = localInteractions[postId]?.liked || false;
  const userDisliked = localInteractions[postId]?.disliked || false;

  const updateInteraction = useCallback(
    (postId: string, interaction: Partial<UserInteraction>) => {
      setLocalInteractions((prev) => ({
        ...prev,
        [postId]: {
          liked: false,
          disliked: false,
          viewed: false,
          ...prev[postId],
          ...interaction,
        },
      }));
    },
    []
  );

  const makeRequest = useCallback(
    async <T = any,>(
      endpoint: string,
      method: "GET" | "POST" | "PATCH" | "DELETE" = "POST",
      body: any = null
    ): Promise<ApiResponse<T>> => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
          body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
    []
  );

  const fetchUserInteractions = useCallback(
    async (postIds: string[]): Promise<void> => {
      if (!currentUser) return;

      try {
        const response = await makeRequest<InteractionsResponse>(
          "/posts/interactions",
          "POST",
          { postIds }
        );
        if (response.success && response.data) {
          setLocalInteractions((prev) => ({
            ...prev,
            ...response.data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user interactions:", error);
      }
    },
    [currentUser, makeRequest]
  );

  // Fixed: Removed fetchUserInteractions from dependency array
  useEffect(() => {
    if (currentUser && postId) {
      fetchUserInteractions([postId]);
    }
  }, [currentUser, postId]);

  const triggerAnimation = (type: keyof AnimationStates): void => {
    setAnimations((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setAnimations((prev) => ({ ...prev, [type]: false }));
    }, 600);
  };

  const handleLike = useCallback(async (): Promise<void> => {
    if (!currentUser || loading.like) return;

    setLoading((prev) => ({ ...prev, like: true }));
    triggerAnimation("like");

    const wasLiked = userLiked;
    const wasDisliked = userDisliked;

    setPostData((prev) => ({
      ...prev,
      likes: wasLiked ? prev.likes - 1 : prev.likes + 1,
      dislikes: wasDisliked && !wasLiked ? prev.dislikes - 1 : prev.dislikes,
    }));

    updateInteraction(postId, {
      liked: !wasLiked,
      disliked: wasDisliked && !wasLiked ? false : userDisliked,
    });

    try {
      const response = await makeRequest<LikeDislikeResponse>(
        `/posts/${postId}/like`
      );
      if (response.success && response.data) {
        setPostData((prev) => ({
          ...prev,
          likes: response.data!.reactions.likes,
          dislikes: response.data!.reactions.dislikes,
        }));

        updateInteraction(postId, {
          liked: response.data.liked,
          disliked: response.data.disliked,
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setPostData((prev) => ({
        ...prev,
        likes: wasLiked ? prev.likes + 1 : prev.likes - 1,
        dislikes: wasDisliked && !wasLiked ? prev.dislikes + 1 : prev.dislikes,
      }));

      updateInteraction(postId, {
        liked: wasLiked,
        disliked: wasDisliked,
      });

      console.error("Failed to toggle like:", error);
    } finally {
      setLoading((prev) => ({ ...prev, like: false }));
    }
  }, [
    currentUser,
    loading.like,
    userLiked,
    userDisliked,
    postId,
    updateInteraction,
    makeRequest,
  ]);

  const handleDislike = useCallback(async (): Promise<void> => {
    if (!currentUser || loading.dislike) return;

    setLoading((prev) => ({ ...prev, dislike: true }));
    triggerAnimation("dislike");

    const wasDisliked = userDisliked;
    const wasLiked = userLiked;

    setPostData((prev) => ({
      ...prev,
      dislikes: wasDisliked ? prev.dislikes - 1 : prev.dislikes + 1,
      likes: wasLiked && !wasDisliked ? prev.likes - 1 : prev.likes,
    }));

    updateInteraction(postId, {
      disliked: !wasDisliked,
      liked: wasLiked && !wasDisliked ? false : userLiked,
    });

    try {
      const response = await makeRequest<LikeDislikeResponse>(
        `/posts/${postId}/dislike`
      );
      if (response.success && response.data) {
        setPostData((prev) => ({
          ...prev,
          likes: response.data!.reactions.likes,
          dislikes: response.data!.reactions.dislikes,
        }));

        // Fixed: Use correct function name
        updateInteraction(postId, {
          liked: response.data.liked,
          disliked: response.data.disliked,
        });
      }
    } catch (error) {
      // Revert optimistic update
      setPostData((prev) => ({
        ...prev,
        dislikes: wasDisliked ? prev.dislikes + 1 : prev.dislikes - 1,
        likes: wasLiked && !wasDisliked ? prev.likes + 1 : prev.likes,
      }));

      // Fixed: Use correct function name
      updateInteraction(postId, {
        liked: wasLiked,
        disliked: wasDisliked,
      });

      console.error("Failed to toggle dislike:", error);
    } finally {
      setLoading((prev) => ({ ...prev, dislike: false }));
    }
  }, [
    currentUser,
    loading.dislike,
    userDisliked,
    userLiked,
    postId,
    updateInteraction,
    makeRequest,
  ]);

  const handleShare = useCallback(async (): Promise<void> => {
    if (loading.share) return;

    setLoading((prev) => ({ ...prev, share: true }));
    triggerAnimation("share");

    try {
      const shareData = {
        title: "Check out this post",
        text: "Found this interesting post, take a look!",
        url: `${window.location.origin}/p/${postId}`,
      };

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Failed to share:", error);
        try {
          await navigator.clipboard.writeText(
            `${window.location.origin}/p/${postId}`
          );
          alert("Link copied to clipboard!");
        } catch (clipboardError) {
          console.error("Failed to copy to clipboard:", clipboardError);
          alert("Sharing failed. Please copy the URL manually.");
        }
      }
    } finally {
      setLoading((prev) => ({ ...prev, share: false }));
    }
  }, [loading.share, postId]);

  const trackView = useCallback(
    async (duration: number = 0): Promise<void> => {
      if (loading.view) return;

      setLoading((prev) => ({ ...prev, view: true }));

      try {
        await makeRequest(`/posts/${postId}/view`, "POST", { duration });

        setPostData((prev) => ({ ...prev, views: prev.views + 1 }));

        if (currentUser) {
          updateInteraction(postId, { viewed: true });
        }
      } catch (error) {
        console.error("Failed to track view:", error);
      } finally {
        setLoading((prev) => ({ ...prev, view: false }));
      }
    },
    [loading.view, postId, currentUser, updateInteraction, makeRequest]
  );

  return {
    postData,
    userLiked,
    userDisliked,
    loading,
    animations,
    handleLike,
    handleDislike,
    handleShare,
    trackView,
    fetchUserInteractions,
  };
};
