// index.ts
export { default as UserProfilePage } from '../../../routes/UserProfilePage/UsersProfile';
export { default as ProfileHeader } from './ProfileHeader/ProfileHeader';
export { default as UserInfo } from './UserInfo/UserInfo';
export { default as ActionSection } from './ActionSection/ActionSection';
export { default as ContentDisplay } from './ContentDisplay/ContentDisplay';

// Export types
export type {
  User,
  Board,
  post,
  UserData,
  SocialStats
} from './types';

// Export utilities
export { getUsernameFromUrl, formatNumber } from './utils';

// Export API functions
export {
  fetchUserByUsername,
  fetchUserBoard,
  fetchUserPosts,
  updateBoardCover,
  updateUserProfilePic
} from './api';