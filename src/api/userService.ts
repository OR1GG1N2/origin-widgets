import api from './DA-Goal';

export interface AuthData {
  token: string;
}

export interface AuthResponse {
  data: AuthData;
}

export const userService = {
  async getProfile() {
    // Axios вернет response.data, который соответствует AuthResponse
    const response = await api.get<AuthResponse>('/profile');
    return response.data; 
  }
};