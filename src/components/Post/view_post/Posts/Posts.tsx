// components/Posts/Posts.tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "./Header/Header";
import HomeSection from "./Sections/HomeSection";
import MessagesSection from "./Sections/MessagesSection";
import useScroll from "../hooks/useScroll";
import "./styles/PostsStyles.css";

// Types
interface User {
  _id: string;
  userName: string;
  fullName: string;
  profilepic?: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  tags: string[];
  location: string;
  user: User;
  reactions: {
    likes: number;
    dislikes: number;
    shares: number;
    saves: number;
  };
  views: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/posts`;
// API function
const fetchPosts = async (
  queryParams?: Record<string, any>
): Promise<PostsResponse> => {
  // Build query string if params provided
  const params = new URLSearchParams();
  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key].toString());
      }
    });
  }

  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  return response.json();
};

// API function for updating reactions
const updatePostReaction = async (
  postId: string,
  type: "likes" | "dislikes" | "shares" | "saves",
  action: "increment" | "decrement"
): Promise<any> => {
   // Replace with your API base URL

  const response = await fetch(`${baseUrl}/${postId}/reactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add your authentication headers here
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ type, action }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${type}: ${response.status}`);
  }

  return response.json();
};

// API function for toggling pin status
const togglePostPin = async (postId: string): Promise<any> => {

  const response = await fetch(`${baseUrl}/${postId}/pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add your authentication headers here
      // 'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle pin: ${response.status}`);
  }

  return response.json();
};

// API function for deleting a post
const deletePost = async (postId: string): Promise<any> => {
  const response = await fetch(`${baseUrl}/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Add your authentication headers here
      // 'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete post: ${response.status}`);
  }

  return response.json();
};

export default function Posts() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const isScrolled = useScroll();
  const queryClient = useQueryClient();

  // TanStack Query for fetching posts
  const {
    data: postsData,
    isLoading: fetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetchPosts({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleSectionToggle = (section: string) => {
    setActiveSection(section);
  };

  // Handle reaction updates
  const handleReactionUpdate = async (
    postId: string,
    type: "likes" | "dislikes" | "shares" | "saves",
    action: "increment" | "decrement"
  ) => {
    try {
      // Call the API to update the reaction
      await updatePostReaction(postId, type, action);

      // Optimistically update the cache
      queryClient.setQueryData(
        ["posts"],
        (oldData: PostsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((post) => {
              if (post._id === postId) {
                const increment = action === "increment" ? 1 : -1;
                return {
                  ...post,
                  reactions: {
                    ...post.reactions,
                    [type]: Math.max(0, post.reactions[type] + increment),
                  },
                };
              }
              return post;
            }),
          };
        }
      );

      // Optionally refetch to ensure data consistency
      // await refetch();
    } catch (error) {
      // console.error(`Error updating ${type}:`, error);

      // Optionally show a toast notification to the user
      // toast.error(`Failed to update ${type}. Please try again.`);

      // Revert optimistic update by refetching
      refetch();

      throw error; // Re-throw so the component can handle it
    }
  };

  // Handle pin toggle
  const handleTogglePin = async (postId: string) => {
    try {
      // Call the API to toggle pin
      await togglePostPin(postId);

      // Optimistically update the cache
      queryClient.setQueryData(
        ["posts"],
        (oldData: PostsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  isPinned: !post.isPinned,
                };
              }
              return post;
            }),
          };
        }
      );
    } catch (error) {
      // console.error('Error toggling pin:', error);

      // Optionally show a toast notification
      // toast.error('Failed to toggle pin. Please try again.');

      // Revert optimistic update by refetching
      refetch();

      throw error;
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    try {
      // Call the API to delete the post
      await deletePost(postId);

      // Remove the post from cache
      queryClient.setQueryData(
        ["posts"],
        (oldData: PostsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((post) => post._id !== postId),
            pagination: {
              ...oldData.pagination,
              totalPosts: oldData.pagination.totalPosts - 1,
            },
          };
        }
      );

      // Optionally show success message
      // toast.success('Post deleted successfully');
    } catch (error) {
      // console.error('Error deleting post:', error);

      // Optionally show error message
      // toast.error('Failed to delete post. Please try again.');

      throw error;
    }
  };

  // Handle refetch
  const handleRefetch = () => {
    refetch();
  };

  // Extract postList from the response data to match your original structure
  const postList = postsData?.data || [];

  // Log for debugging (same as your original)
  // console.log(postList);

  // Handle error state if needed
  if (error) {
    // console.error("Error fetching posts:", error);
  }

  return (
    <div className="posts-container">
      <Header
        isScrolled={isScrolled}
        activeSection={activeSection}
        onSectionToggle={handleSectionToggle}
      />

      <div className="posts-content">
        <HomeSection
          isActive={activeSection === "home"}
          fetching={fetching}
          postList={postList}
          onRefetch={handleRefetch}
          onDeletePost={handleDeletePost}
          onReactionUpdate={handleReactionUpdate}
          onTogglePin={handleTogglePin}
        />

        <MessagesSection isActive={activeSection === "messages"} />
      </div>
    </div>
  );
}
