import { io } from 'socket.io-client';
import { API_CONSTANTS } from './api.constants';

export const createSocketConnection = () => {
  return io(API_CONSTANTS.BASE_URL || undefined, {
    withCredentials: true,
  });
};
