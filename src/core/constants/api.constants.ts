export const API_CONSTANTS = {
  BASE_URL: 'http://localhost:7777',

  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
  },
  PROFILE: {
    VIEW: '/api/profile/view',
  },
} as const;
