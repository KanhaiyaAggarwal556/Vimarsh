import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// Import your existing components
import HomePage from "./routes/HomePage/HomePage";
import SearchPage from "./routes/SearchPage/SearchPage";
import CreatePostPage from "./routes/CreatePostPage/CreatePostPage";
import PostPage from "./routes/PostPage/PostPage";
import Twitty from "./routes/TwittyPage/TwittyPage";
import Login from "./routes/Auth/LoginPage";
import MainLayoutPage from "./routes/Layout/MainLayoutPage";
import SearchPageLayout from "./routes/Layout/SearchPageLayout";
import Notification from "./routes/Notification/Notification";
import ContactPage from "./routes/ContactPage/ContactPage";
import PhotoPage from "./routes/PhotoPage/PhotoPage";
import ForgotPasswordPage from "./routes/Auth/PasswordResetSystem";
import UserProfilePage from "./routes/UserProfilePage/UsersProfile";
import FeaturesPage from "./routes/FeaturesPage/FeaturesPage";
import About from "./routes/AboutPage/About";
import SignUpPage from "./routes/Auth/SignUpPage";

// Import auth components
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";
import OAuthSuccessHandler from "./auth/OAuthSuccessHandler";

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount: number, error: Error) => {
        const status = (error as any)?.status;
        if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
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
        <AuthProvider>
          <Routes>
            {/* OAuth Success Handler - MUST be BEFORE other routes */}
            <Route path="/oauth-success" element={<OAuthSuccessHandler />} />

            {/* Protected Routes - Require Authentication */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayoutPage />
                </ProtectedRoute>
              }
            >
              {/* Root route redirects to home */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Home and Messages routes - both use the same HomePage component */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/messages" element={<HomePage />} />
              
              {/* Other routes */}
              <Route path="/createpost" element={<CreatePostPage />} />
              <Route path="/p/:postId" element={<PostPage />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/featurePanel" element={<FeaturesPage />} />
              <Route path="/about" element={<About/>}/>

              {/* Profile routes */}
              <Route path="/:username" element={<UserProfilePage />} />
              <Route path="/:username/posts" element={<UserProfilePage />} />
              <Route path="/:username/about" element={<UserProfilePage />} />
              <Route
                path="/:username/bookmarks"
                element={<UserProfilePage />}
              />
              <Route path="/:username/media" element={<UserProfilePage />} />
            </Route>

            {/* Protected Search Layout Route */}
            <Route
              element={
                <ProtectedRoute>
                  <SearchPageLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/i/twitty" element={<Twitty />} />
            </Route>

            {/* Protected Photo Route */}
            <Route
              path="/:username/status/:id/photo/:num"
              element={
                <ProtectedRoute>
                  <PhotoPage />
                </ProtectedRoute>
              }
            />

            {/* Public Routes - Redirect to home if authenticated */}
            <Route
              path="/i/account/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/i/account/signup"
              element={
                <PublicRoute>
                  <SignUpPage/>
                </PublicRoute>
              }
            />
            <Route
              path="/i/account/forgotpassword"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ebe8e8ff",
            color: "#333333ff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#000000ff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* ReactQuery DevTools */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);