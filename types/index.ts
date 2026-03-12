export interface PublicUser {
  id: string;
  name: string | null;
  email: string;
  credits?: number;
  createdAt: Date;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
  message: string;
}

export interface ApiError {
  message: string;
}
