// Updated main.tsx with improved QueryClient configuration
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import HomePage from "./routes/HomePage/HomePage.js";
import SearchPage from "./routes/SearchPage/SearchPage.js";
import CreatePostPage from "./routes/CreatePostPage/CreatePostPage.js";
import PostPage from "./routes/PostPage/PostPage.js";
import Twitty from "./routes/TwittyPage/TwittyPage.js";
import LoginPage from "./routes/Auth/LoginPage.js";
import MainLayoutPage from "./routes/Layout/MainLayoutPage.js";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchPageLayout from "./routes/Layout/SearchPageLayout.js";
import Notification from "./routes/Notification/Notification.js";
import ContactPage from "./routes/ContactPage/ContactPage.js";
import PhotoPage from "./routes/PhotoPage/PhotoPage.js";
import SignUpPage from "./routes/Auth/SignUpPage.js";
import ForgotPasswordPage from "./routes/Auth/ForgotPasswordPage.js";
import UserProfilePage from "./routes/UserProfilePage/UsersProfile.js";

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
    },
    mutations: {
      retry: 1,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayoutPage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/createpost" element={<CreatePostPage />} />
            <Route path="/p/:postId" element={<PostPage />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* Profile routes - same component, different tabs */}
            <Route path="/:username" element={<UserProfilePage />} />
            <Route path="/:username/posts" element={<UserProfilePage />} />
            <Route path="/:username/about" element={<UserProfilePage />} />
            <Route path="/:username/bookmarks" element={<UserProfilePage />} />
            <Route path="/:username/media" element={<UserProfilePage />} />
          </Route>
          <Route element={<SearchPageLayout />}>
            <Route path="/i/twitty" element={<Twitty />} />
          </Route>
          <Route
            path="/:username/status/:id/photo/:num"
            element={<PhotoPage />}
          />
          <Route path="/i/account/login" element={<LoginPage />} />
          <Route path="/i/account/signup" element={<SignUpPage />} />
          <Route
            path="/i/account/forgotpassword"
            element={<ForgotPasswordPage />}
          />
        </Routes>
      </BrowserRouter>
      
      {/* ReactQuery DevTools - only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);