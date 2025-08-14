// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from 'react-hot-toast';

// Import components
import HomePage from "./routes/HomePage/HomePage";
import SearchPage from "./routes/SearchPage/SearchPage";
import CreatePostPage from "./routes/CreatePostPage/CreatePostPage";
import PostPage from "./routes/PostPage/PostPage";
import Twitty from "./routes/TwittyPage/TwittyPage";
import LoginPage from "./routes/Auth/LoginPage";
import MainLayoutPage from "./routes/Layout/MainLayoutPage";
import SearchPageLayout from "./routes/Layout/SearchPageLayout";
import Notification from "./routes/Notification/Notification";
import ContactPage from "./routes/ContactPage/ContactPage";
import PhotoPage from "./routes/PhotoPage/PhotoPage";
import SignUpPage from "./routes/Auth/SignUpPage";
import ForgotPasswordPage from "./routes/Auth/ForgotPasswordPage";
import UserProfilePage from "./routes/UserProfilePage/UsersProfile";

// Import styles
import "bootstrap/dist/css/bootstrap.min.css";

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount: number, error: Error) => {
        // Don't retry on 4xx errors except 408, 429
        const status = (error as any)?.status;
        if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
          return false;
        }
        return failureCount < 2;
      },
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
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* ReactQuery DevTools - only shows in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </StrictMode>
);