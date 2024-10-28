import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { v4 as uuidv4 } from 'uuid';

export const createAccessToken = (entity, options = {}) => {
  const payload = {
    id: entity._id,      // ID de la entidad (usuario o empresa)
    role: entity.role,   // Rol de la entidad
    jti: uuidv4(),       // Identificador único (JWT ID)
  };

  const defaultOptions = { expiresIn: '1h' };
  const combinedOptions = { ...defaultOptions, ...options }; // Combina opciones predeterminadas y personalizadas

  return jwt.sign(payload, TOKEN_SECRET, combinedOptions);
};

// Esta función sigue igual
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
