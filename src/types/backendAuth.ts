// types/backendAuth.ts
export interface BackendUserDTO {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  full_name?: string;
  userName?: string;
  username?: string;
  user_name?: string;
  email?: string;
  profilepic?: string;
  avatar?: string;
  profilePicture?: string;
  profile_picture?: string;
  isAdmin?: boolean;
  admin?: boolean;
  is_admin?: boolean;
  lastLogin?: string;
  lastLoginAt?: string;
  last_login_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface UserDTO {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  userName?: string;
  username?: string;
  email?: string;
  profilepic?: string;
  avatar?: string;
  isAdmin?: boolean;
  admin?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface BackendAuthResponse<T = any> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  user?: T extends { user?: infer U } ? U : any;
  resetToken?: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserDTO;
  resetToken?: string;
}