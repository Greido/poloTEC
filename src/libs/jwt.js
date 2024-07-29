import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { v4 as uuidv4 } from 'uuid';

export const createAccessToken = (user, options = {}) => {
  const payload = {
    id: user._id,
    role: user.role,
    jti: uuidv4(), // Unique identifier (JWT ID)
  };
  const defaultOptions = { expiresIn: '1h' };
  const combinedOptions = { ...defaultOptions, ...options }; // Combine default and custom options

  return jwt.sign(payload, TOKEN_SECRET, combinedOptions);
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      console.error('Unexpected token verification error:', error);
      throw new Error('Token verification failed');
    }
  }
};
