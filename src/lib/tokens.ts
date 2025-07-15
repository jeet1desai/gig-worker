import jwt from 'jsonwebtoken';

import { serverEnv } from '@/lib/config/serverEnv';
import { EMAIL_TOKEN_EXPIRY_TIME } from '@/constants';

export const generateEmailVerificationToken = (payload: { userId: string; email: string }) => {
  return jwt.sign(payload, serverEnv.JWT_EMAIL_SECRET, {
    expiresIn: EMAIL_TOKEN_EXPIRY_TIME
  });
};

export const verifyEmailVerificationToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, serverEnv.JWT_EMAIL_SECRET) as {
    userId: string;
    email: string;
  };
};
