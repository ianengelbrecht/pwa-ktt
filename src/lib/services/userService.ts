import { db } from '../db/db';
import type { UserService } from './types';

const { users } = db;

export const userService: UserService = {
  ...users,
};
