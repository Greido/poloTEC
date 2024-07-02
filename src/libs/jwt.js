import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const createAccessToken = (entity) => {
  return jwt.sign({ id: entity._id, role: entity.role }, TOKEN_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};