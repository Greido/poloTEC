import { verifyToken } from '../libs/jwt.js';
import User from '../schemas/user.model.js';
import Enterprise from '../schemas/enterprise.model.js';

export const validateRequired = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    res.locals.decoded = decoded; // Guarda el payload decodificado en res.locals para usarlo en otras partes

    // Verifica el rol
    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.locals.user = user;
    } else if (decoded.role === 'ent') {
      const enterprise = await Enterprise.findById(decoded.id);
      if (!enterprise) {
        return res.status(404).json({ message: 'Enterprise not found' });
      }
      res.locals.enterprise = enterprise;
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Error verifying token' });
  }
};
