import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import NewsFeed from "./NewsFeed";
import NewsFeedContent from "./NewsFeedContent";
import FollowingList from "./FollowingList";
import FollowerList from "./FollowerList";
import Profile from "./Profile";
import MyProfile from "./MyProfile";
import AllAccounts from "./AllAccounts";
import UnauthorizedPage from "./UnauthorizedPage";
import NotFoundPage from "./NotFoundPage";
import Chat from "./Chat"; // Импортируем компонент Chat

function AppContainer() {
  return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/newsfeed" element={<NewsFeed />}>
            <Route path="" element={<NewsFeedContent />} />
            <Route path="following" element={<FollowingList />} />
            <Route path="follower" element={<FollowerList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="myprofile" element={<MyProfile />} />
            <Route path="allaccounts" element={<AllAccounts />} />
            <Route path="chat" element={<Chat />} /> {/* Добавляем маршрут для чата */}
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
  );
}

export default AppContainer;