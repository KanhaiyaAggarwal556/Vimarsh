import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./routes/HomePage/HomePage.jsx";
import SearchPage from "./routes/SearchPage/SearchPage.jsx";
import ProfilePage from "./routes/ProfilePage/ProfilePage.jsx";
import CreatePostPage from "./routes/CreatePostPage/CreatePostPage.jsx";
import PostPage from "./routes/PostPage/PostPage.jsx";
import Twitty from "./routes/TwittyPage/TwittyPage.jsx";
import Auth from "./routes/AuthPage/UserAuth.jsx";
import MainLayoutPage from "./routes/Layout/MainLayoutPage/MainLayoutPage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchPageLayout from "./routes/Layout/SearchPageLayout.jsx";
import Notification from "./routes/Notification/Notification.jsx";
import ContactPage from "./routes/ContactPage/ContactPage.jsx";
import PhotoPage from "./routes/PhotoPage/PhotoPage.jsx";
import UserPageLayout from "./routes/Layout/UserPageLayout/UserPageLayout.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayoutPage />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/createpost" element={<CreatePostPage />} />
          <Route path="/:username/status/:id" element={<PostPage />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route element={<SearchPageLayout />}>
          <Route path="/i/twitty" element={<Twitty />} />
        </Route>
        <Route element={<UserPageLayout />}>
          <Route path="/:username" element={<ProfilePage />} />
        </Route>
        <Route
          path="/:username/status/:id/photo/:num"
          element={<PhotoPage />}
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
