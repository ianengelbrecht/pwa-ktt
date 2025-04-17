import { db } from '../dbInterface';
import type { UserService } from './types';

const { users } = db;

export const userService: UserService = {
  ...users,
};
