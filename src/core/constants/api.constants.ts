export const API_CONSTANTS = {
  BASE_URL: location.hostname === 'localhost' ? 'http://localhost:7777' : '',

  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
  },
  PROFILE: {
    VIEW: '/api/profile/view',
    EDIT: '/api/profile/edit',
  },
  USER: {
    CONNECTIONS: '/api/user/connections',
    REQUESTS_RECEIVED: '/api/user/requests/received',
    FEED: '/api/user/feed',
  },
  REQUEST: {
    SEND: '/api/request/send',
    REVIEW: '/api/request/review',
  },
} as const;
