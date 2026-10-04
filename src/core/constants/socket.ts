import { io } from 'socket.io-client';
import { API_CONSTANTS } from './api.constants';

export const createSocketConnection = () => {
  if (location.hostname === 'localhost') {
    return io(API_CONSTANTS.BASE_URL, {
      withCredentials: true,
    });
  }

  return io('/', {
    path: '/socket.io',
    withCredentials: true,
  });
};
