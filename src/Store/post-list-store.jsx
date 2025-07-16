import { createContext, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";

PostsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PostList = createContext({
  postList: [],
  fetching: false,
  addPost: () => {},
  deletePost: () => {},
});

const PostListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  } else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList];
  } else if (action.type === "ADD_INITIAL_POST") {
    newPostList = action.payload.posts;
  }
  return newPostList;
};

export default function PostsProvider({ children }) {
  const [postList, dispatchPostList] = useReducer(PostListReducer, []);
  const [fetching, setFetching] = useState(false);
  
  const addInitialPost = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POST",
      payload: {
        posts,
      },
    });
  };

  const addPost = (userId, postTitle, postBody, reactions, tags, images = null, videos = null) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: {
        id: Date.now(),
        userId: userId,
        title: postTitle,
        body: postBody,
        reactions: reactions,
        tags: tags,
        views: 0, // New posts start with 0 views
        images: images,
        videos: videos,
        comments: [], // New posts start with empty comments
        timestamp: new Date().toISOString(),
      },
    });
  };

  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setFetching(true);
    
    fetch("https://twooter-backend.onrender.com/api/posts", { signal })
      .then((res) => res.json())
      .then((data) => {
        // Updated to handle new database structure
        // If your API returns the full database structure, extract PostData
        const posts = data.PostData || data.posts || data;
        addInitialPost(posts);
        setFetching(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching posts:', error);
          setFetching(false);
        }
      });
    
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <PostList.Provider
      value={{ postList: postList, fetching, addPost, deletePost }}
    >
      {children}
    </PostList.Provider>
  );
}